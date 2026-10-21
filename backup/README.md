# ชุดข้อมูลสำรอง (Backup data)

ไฟล์ในโฟลเดอร์นี้คือผลลัพธ์จากการรัน `gee/01_export_drought.js` ของผู้สอน
(asset `Amhoe_NR`, ปี 2015–2025, เดือน 1–12) ใช้เมื่องาน Export ของ GEE ล่าช้าหรือล้มเหลว

```bash
cp backup/data/korat_drought_* docs/data/
cp backup/data/png/*.png docs/data/png/
```

ข้อควรทราบ: ค่า TCI ปี 2025 สูงเกือบ 100 ทุกอำเภอ ซึ่งผิดปกติ
ให้ตรวจผลในส่วน "จำนวนภาพ MODIS และ LST เฉลี่ยรายปี" ของ Console ใน GEE ก่อนแปลผลปี 2025
