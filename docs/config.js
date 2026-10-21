/* =============================================================
 * config.js — ค่าตั้งของ Web map (แก้เฉพาะไฟล์นี้)
 * -------------------------------------------------------------
 * หลัง export ข้อมูลจาก GEE ให้เปลี่ยน 2 บรรทัดแรกเป็น
 *   districtsUrl: 'data/korat_drought_districts.geojson',
 *   provinceUrl:  'data/korat_drought_province.csv',
 * ถ้ายังเป็นไฟล์ demo_ หน้าเว็บจะแสดงแถบเตือน "ค่าจำลอง" เสมอ
 * ============================================================= */
window.CONFIG = {
  districtsUrl: 'data/demo_districts.geojson',
  provinceUrl:  'data/demo_province.csv',
  pngDir: 'data/png/',
  bbox: [101.15, 14.10, 103.05, 15.83],   // ต้องตรงกับ BBOX ในสคริปต์ GEE
  nameField: 'amp_th',                    // ฟิลด์ชื่ออำเภอที่แสดงใน popup
  affectedYear: 2018,
  startIndex: 'VHI',                      // VHI | VCI | TCI | SPA
  startYear: 2018
};
