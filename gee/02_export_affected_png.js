/**
 * 412345 Internet Mapping — Lab: Korat Drought WebMap
 * Re-export ONLY affected_<YEAR>.png (purple 6a3d9a)
 * Same method and settings as 01_export_drought.js
 */

// ========================= CONFIG (same as 01) =========================
var DISTRICT_ASSET = 'projects/ee-sarochineek/assets/Amhoe_NR';
var START_YEAR  = 2015;
var END_YEAR    = 2025;
var START_MONTH = 1;
var END_MONTH   = 12;
var AFFECTED_YEAR = 2018;
var AFFECTED_VHI  = 40;
var BBOX = [101.15, 14.10, 103.05, 15.83];   // must equal CONFIG.bbox in app.js
var PNG_WIDTH = 1200;
var COLOR = '6a3d9a';                        // must equal legend colour in app.js
// =======================================================================

var province = ee.FeatureCollection(DISTRICT_ASSET).geometry().dissolve(100);
var region   = ee.Geometry.Rectangle(BBOX, 'EPSG:4326', false);
var landMask = ee.Image('JRC/GSW1_4/GlobalSurfaceWater').select('occurrence')
                 .gte(75).unmask(0).not();

function seasonStart(y) { return ee.Date.fromYMD(y, START_MONTH, 1); }
function seasonEnd(y)   { return ee.Date.fromYMD(y, END_MONTH, 1).advance(1, 'month'); }
function ndviOf(y) {
  return ee.ImageCollection('MODIS/061/MOD13Q1').filterDate(seasonStart(y), seasonEnd(y))
    .select('NDVI').mean().multiply(0.0001);
}
function lstOf(y) {
  return ee.ImageCollection('MODIS/061/MOD11A2').filterDate(seasonStart(y), seasonEnd(y))
    .select('LST_Day_1km').mean().multiply(0.02).subtract(273.15);
}

var years = [];
for (var y = START_YEAR; y <= END_YEAR; y++) { years.push(y); }
var ndviCol = ee.ImageCollection(years.map(ndviOf));
var lstCol  = ee.ImageCollection(years.map(lstOf));
var ndviMin = ndviCol.min(), ndviMax = ndviCol.max();
var lstMin  = lstCol.min(),  lstMax  = lstCol.max();

var vci = ndviOf(AFFECTED_YEAR).subtract(ndviMin).divide(ndviMax.subtract(ndviMin)).multiply(100);
var tci = lstMax.subtract(lstOf(AFFECTED_YEAR)).divide(lstMax.subtract(lstMin)).multiply(100);
var vhi = vci.multiply(0.5).add(tci.multiply(0.5)).updateMask(landMask).clip(province);

var cropland = ee.ImageCollection('ESA/WorldCover/v100').first().clip(province).eq(40);
var affected = cropland.and(vhi.lt(AFFECTED_VHI)).selfMask();

// ---------- PNG link ----------
var fileName = 'affected_' + AFFECTED_YEAR + '.png';
affected.visualize({palette: [COLOR]}).getThumbURL({
  region: region, dimensions: PNG_WIDTH, crs: 'EPSG:3857', format: 'png'
}, function (url) {
  print(ui.Label('⬇ ' + fileName + ' (คลิกเพื่อดาวน์โหลด แล้วตั้งชื่อตามนี้)', {color: '0b7285'}, url));
});

// ---------- Check ----------
print('พื้นที่เกษตรที่ VHI < ' + AFFECTED_VHI + ' ปี ' + AFFECTED_YEAR + ' (ตร.กม.):',
      affected.multiply(ee.Image.pixelArea()).divide(1e6).reduceRegion({
        reducer: ee.Reducer.sum(), geometry: province, scale: 100,
        maxPixels: 1e10, tileScale: 4
      }));

Map.centerObject(province, 9);
Map.addLayer(affected, {palette: [COLOR]}, 'Affected cropland ' + AFFECTED_YEAR);
Map.addLayer(ee.Image().byte().paint(ee.FeatureCollection(DISTRICT_ASSET), 0, 1),
             {palette: ['222222']}, 'Districts');
