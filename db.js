// db.js - SQLite schema + seed for Baba Saleh store
const Database = require('better-sqlite3');
const path = require('path');
const crypto = require('crypto');

const fs = require('fs');
const DATA_DIR = process.env.DATA_DIR || __dirname;
fs.mkdirSync(path.join(DATA_DIR, 'uploads'), { recursive: true });
const db = new Database(path.join(DATA_DIR, 'store.db'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  brand TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'رجالي',
  price INTEGER NOT NULL,            -- EGP, whole pounds
  old_price INTEGER,
  description TEXT NOT NULL DEFAULT '',
  sizes TEXT NOT NULL DEFAULT '[]',  -- JSON array
  colors TEXT NOT NULL DEFAULT '[]', -- JSON array of hex
  stock INTEGER NOT NULL DEFAULT 0,
  tint TEXT NOT NULL DEFAULT 't1',   -- placeholder tint class until a photo is set
  icon TEXT NOT NULL DEFAULT 'i-tee',
  is_offer INTEGER NOT NULL DEFAULT 0,
  is_new INTEGER NOT NULL DEFAULT 0,
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS product_photos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  file TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  number TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  governorate TEXT NOT NULL,
  address TEXT NOT NULL,
  payment TEXT NOT NULL,             -- cod | transfer
  receipt_file TEXT,
  subtotal INTEGER NOT NULL,
  shipping INTEGER NOT NULL,
  total INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'جديد',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER,
  name TEXT NOT NULL,
  size TEXT NOT NULL DEFAULT '',
  color TEXT NOT NULL DEFAULT '',
  qty INTEGER NOT NULL,
  price INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
`);

const getSetting = db.prepare('SELECT value FROM settings WHERE key=?');
const setSetting = db.prepare('INSERT INTO settings (key,value) VALUES (?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value');

function setting(key, fallback) {
  const row = getSetting.get(key);
  return row ? row.value : fallback;
}

function seed() {
  if (!getSetting.get('shipping_fee')) {
    const defaults = {
      store_name: 'بابا صالح',
      store_tagline: 'للملابس الجاهزة • السوق الحضاري',
      shipping_fee: '80',
      whatsapp: '201000000000', // placeholder until the owner sets his real number in admin
      transfer_info: 'فودافون كاش / انستاباي — الرقم هيتظهر هنا من لوحة التحكم',
      hours: '',
    };
    for (const [k, v] of Object.entries(defaults)) setSetting.run(k, v);
  }
  const count = db.prepare('SELECT COUNT(*) c FROM products').get().c;
  if (count > 0) return;
  const ins = db.prepare(`INSERT INTO products (name,brand,category,price,old_price,description,sizes,colors,stock,tint,icon,is_offer,is_new)
    VALUES (@name,@brand,@category,@price,@old_price,@description,@sizes,@colors,@stock,@tint,@icon,@is_offer,@is_new)`);
  const demo = [
    { name:'طقم حمالة وبوكسر رجالي', brand:'دايس', category:'رجالي', price:235, old_price:275, tint:'t1', icon:'i-tee', is_offer:1, is_new:0,
      description:'طقم قطن مريح للاستخدام اليومي، خامة تقيلة تتحمل الغسيل.' },
    { name:'فانلة داخلية قطن رجالي', brand:'قطونيل', category:'رجالي', price:185, old_price:null, tint:'t2', icon:'i-tee', is_offer:0, is_new:0, description:'فانلة قطن ١٠٠٪ ناعمة على الجلد.' },
    { name:'طقم حريمي قطن ٣ قطع', brand:'نواعم', category:'حريمي', price:325, old_price:375, tint:'t3', icon:'i-dress', is_offer:1, is_new:0, description:'طقم بيتي قطن مريح، ٣ قطع.' },
    { name:'بوكسر أولادي ٣ قطع', brand:'عثمان', category:'أولادي', price:155, old_price:null, tint:'t4', icon:'i-kid', is_offer:0, is_new:0, description:'بوكسر قطن أولادي، عبوة ٣ قطع.' },
    { name:'فانلة كت رجالي', brand:'لاسو', category:'رجالي', price:165, old_price:null, tint:'t5', icon:'i-tee', is_offer:0, is_new:1, description:'فانلة كت خفيفة للصيف والبيت.' },
    { name:'طقم بيتي حريمي شتوي', brand:'لوليتا', category:'حريمي', price:425, old_price:null, tint:'t6', icon:'i-dress', is_offer:0, is_new:1, description:'طقم بيتي شتوي دافئ.' },
    { name:'طقم قطن كامل رجالي', brand:'سيما', category:'رجالي', price:295, old_price:325, tint:'t3', icon:'i-tee', is_offer:1, is_new:0, description:'طقم قطن كامل بخامة ممتازة.' },
    { name:'طقم داخلي شتوي رجالي', brand:'الدباغ', category:'رجالي', price:340, old_price:null, tint:'t6', icon:'i-tee', is_offer:0, is_new:0, description:'طقم داخلي شتوي ثقيل.' },
    { name:'بوكسر رجالي ٣ قطع', brand:'عثمان', category:'رجالي', price:175, old_price:null, tint:'t4', icon:'i-tee', is_offer:0, is_new:0, description:'بوكسر قطن رجالي، عبوة ٣ قطع.' },
    { name:'طقم ميلك حريمي', brand:'ميلك', category:'حريمي', price:295, old_price:null, tint:'t2', icon:'i-dress', is_offer:0, is_new:1, description:'طقم قطن حريمي ناعم.' },
  ];
  const sizes = JSON.stringify(['M','L','XL','2XL','3XL']);
  const colors = JSON.stringify(['#2b3a4a','#8a939e','#f3f3f3','#5b3a3a']);
  const tx = db.transaction(() => {
    for (const d of demo) ins.run({ ...d, sizes, colors, stock: 14 });
  });
  tx();
}
seed();

function newOrderNumber() {
  const row = db.prepare("SELECT value FROM settings WHERE key='order_seq'").get();
  const n = (row ? parseInt(row.value, 10) : 1000) + 1;
  setSetting.run('order_seq', String(n));
  return 'BS-' + n;
}

function newAdminToken() {
  const t = crypto.randomBytes(24).toString('hex');
  setSetting.run('admin_token', t);
  return t;
}

module.exports = { db, setting, setSetting, newOrderNumber, newAdminToken };
