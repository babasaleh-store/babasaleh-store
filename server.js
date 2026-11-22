// server.js - Baba Saleh store: storefront + admin panel
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { db, setting, setSetting, newOrderNumber, newAdminToken } = require('./db');
const V = require('./views');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
const DATA_DIR = process.env.DATA_DIR || __dirname;
app.use('/uploads', express.static(path.join(DATA_DIR, 'uploads')));

const upload = multer({
  storage: multer.diskStorage({
    destination: path.join(DATA_DIR, 'uploads'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + crypto.randomBytes(4).toString('hex') + path.extname(file.originalname).toLowerCase()),
  }),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (req, file, cb) => cb(null, /^image\//.test(file.mimetype)),
});

/* settings bundle */
function settings() {
  return {
    store_name: setting('store_name', 'بابا صالح'),
    store_tagline: setting('store_tagline', ''),
    shipping_fee: setting('shipping_fee', '80'),
    whatsapp: setting('whatsapp', ''),
    transfer_info: setting('transfer_info', ''),
    hours: setting('hours', ''),
  };
}

/* cart cookie: [{id,size,color,qty}] */
function readCart(req) {
  try {
    const raw = req.headers.cookie?.split(';').map((s) => s.trim()).find((s) => s.startsWith('cart='));
    if (!raw) return [];
    const arr = JSON.parse(Buffer.from(decodeURIComponent(raw.slice(5)), 'base64').toString('utf8'));
    return Array.isArray(arr) ? arr.filter((x) => x && Number.isInteger(x.id) && x.qty > 0) : [];
  } catch { return []; }
}
function writeCart(res, cart) {
  const v = Buffer.from(JSON.stringify(cart.slice(0, 50)), 'utf8').toString('base64');
  res.setHeader('Set-Cookie', `cart=${encodeURIComponent(v)}; Path=/; Max-Age=${60 * 60 * 24 * 30}; SameSite=Lax`);
}
const cartCount = (req) => readCart(req).reduce((a, x) => a + x.qty, 0);

const prodById = db.prepare('SELECT * FROM products WHERE id=? AND active=1');
const photoOf = db.prepare('SELECT file FROM product_photos WHERE product_id=? ORDER BY position LIMIT 1');
const withPhoto = (p) => ({ ...p, photo: photoOf.get(p.id)?.file || null });

function cartItems(req) {
  return readCart(req).map((x) => {
    const p = prodById.get(x.id);
    if (!p) return null;
    return { key: `${x.id}|${x.size || ''}|${x.color || ''}`, id: p.id, name: p.name, brand: p.brand, price: p.price, tint: p.tint, icon: p.icon, photo: photoOf.get(p.id)?.file || null, size: x.size || '', color: x.color || '', qty: Math.min(x.qty, 99) };
  }).filter(Boolean);
}

/* ---------- storefront ---------- */
app.get('/', (req, res) => {
  const s = settings();
  const all = db.prepare('SELECT * FROM products WHERE active=1').all();
  const brands = [...new Set(all.map((p) => p.brand).filter(Boolean))];
  const offers = all.filter((p) => p.is_offer).slice(0, 4).map(withPhoto);
  const fresh = all.filter((p) => p.is_new).slice(0, 4).map(withPhoto);
  res.send(V.home({ settings: s, offers, fresh, brands, cartCount: cartCount(req) }));
});

app.get('/c/:cat', (req, res) => {
  const s = settings();
  const cat = req.params.cat;
  let rows;
  if (cat === 'عروض') rows = db.prepare('SELECT * FROM products WHERE active=1 AND is_offer=1').all();
  else rows = db.prepare('SELECT * FROM products WHERE active=1 AND category=?').all(cat);
  const brands = [...new Set(rows.map((p) => p.brand).filter(Boolean))];
  const activeBrand = req.query.brand || '';
  if (activeBrand) rows = rows.filter((p) => p.brand === activeBrand);
  res.send(V.categoryPage({ settings: s, products: rows.map(withPhoto), title: cat, brands, activeBrand, cartCount: cartCount(req) }));
});

app.get('/brand/:brand', (req, res) => {
  const s = settings();
  const brand = req.params.brand;
  const rows = db.prepare('SELECT * FROM products WHERE active=1 AND brand=?').all(brand);
  const brands = [...new Set(db.prepare('SELECT brand FROM products WHERE active=1').all().map((r) => r.brand).filter(Boolean))];
  res.send(V.categoryPage({ settings: s, products: rows.map(withPhoto), title: brand, brands, activeBrand: brand, cartCount: cartCount(req) }));
});

app.get('/search', (req, res) => {
  const s = settings();
  const q = (req.query.q || '').trim();
  const rows = q ? db.prepare('SELECT * FROM products WHERE active=1 AND (name LIKE ? OR brand LIKE ? OR description LIKE ?)').all(`%${q}%`, `%${q}%`, `%${q}%`) : [];
  res.send(V.searchPage({ settings: s, q, products: rows.map(withPhoto), cartCount: cartCount(req) }));
});

app.get('/p/:id', (req, res) => {
  const s = settings();
  const p = prodById.get(req.params.id);
  if (!p) return res.redirect('/');
  const photos = db.prepare('SELECT * FROM product_photos WHERE product_id=? ORDER BY position').all(p.id);
  const similar = db.prepare('SELECT * FROM products WHERE active=1 AND category=? AND id != ? LIMIT 3').all(p.category, p.id).map(withPhoto);
  res.send(V.productPage({ settings: s, p, photos, similar, cartCount: cartCount(req) }));
});

app.post('/cart/add', (req, res) => {
  const id = parseInt(req.body.product_id, 10);
  const p = prodById.get(id);
  if (!p) return res.redirect('/');
  const cart = readCart(req);
  const key = (x) => `${x.id}|${x.size || ''}|${x.color || ''}`;
  const entry = { id, size: req.body.size || '', color: req.body.color || '', qty: Math.max(1, Math.min(99, parseInt(req.body.qty, 10) || 1)) };
  const existing = cart.find((x) => key(x) === key(entry));
  if (existing) existing.qty = Math.min(99, existing.qty + entry.qty); else cart.push(entry);
  writeCart(res, cart);
  res.redirect('/cart');
});

app.post('/cart/update', (req, res) => {
  const cart = readCart(req);
  const key = req.body.key;
  const delta = parseInt(req.body.delta, 10) || 0;
  const item = cart.find((x) => `${x.id}|${x.size || ''}|${x.color || ''}` === key);
  if (item) item.qty += delta;
  writeCart(res, cart.filter((x) => x.qty > 0));
  res.redirect('/cart');
});

app.get('/cart', (req, res) => {
  const items = cartItems(req);
  res.send(V.cartPage({ settings: settings(), items, subtotal: items.reduce((a, x) => a + x.price * x.qty, 0), cartCount: cartCount(req) }));
});

app.get('/checkout', (req, res) => {
  const items = cartItems(req);
  if (!items.length) return res.redirect('/cart');
  res.send(V.checkoutPage({ settings: settings(), items, subtotal: items.reduce((a, x) => a + x.price * x.qty, 0), cartCount: cartCount(req) }));
});

app.post('/checkout', upload.single('receipt'), (req, res) => {
  const items = cartItems(req);
  if (!items.length) return res.redirect('/cart');
  const s = settings();
  const subtotal = items.reduce((a, x) => a + x.price * x.qty, 0);
  const { name, phone, governorate, address, payment } = req.body;
  const err = (msg) => res.status(400).send(V.checkoutPage({ settings: s, items, subtotal, cartCount: cartCount(req), error: msg, form: req.body }));
  if (!name || name.trim().length < 3) return err('من فضلك اكتب اسمك بالكامل');
  if (!/^01[0-9]{9}$/.test((phone || '').trim())) return err('رقم الموبايل مش صح — لازم يكون ١١ رقم ويبدأ بـ 01');
  if (!governorate) return err('اختار المحافظة');
  if (!address || address.trim().length < 5) return err('اكتب العنوان بالتفصيل');
  if (!['cod', 'transfer'].includes(payment)) return err('اختار طريقة الدفع');
  if (payment === 'transfer' && !req.file) return err('لو اخترت تحويل، لازم ترفع صورة التحويل');

  const shipping = Number(s.shipping_fee);
  const number = newOrderNumber();
  const tx = db.transaction(() => {
    const info = db.prepare(`INSERT INTO orders (number,customer_name,phone,governorate,address,payment,receipt_file,subtotal,shipping,total)
      VALUES (?,?,?,?,?,?,?,?,?,?)`).run(number, name.trim(), phone.trim(), governorate, address.trim(), payment, req.file?.filename || null, subtotal, shipping, subtotal + shipping);
    const oid = info.lastInsertRowid;
    const insItem = db.prepare('INSERT INTO order_items (order_id,product_id,name,size,color,qty,price) VALUES (?,?,?,?,?,?,?)');
    for (const it of items) insItem.run(oid, it.id, it.name + (it.brand ? ' — ' + it.brand : ''), it.size, it.color, it.qty, it.price);
    return oid;
  });
  const oid = tx();
  writeCart(res, []);
  res.redirect(`/order/${oid}`);
});

app.get('/order/:id', (req, res) => {
  const order = db.prepare('SELECT * FROM orders WHERE id=?').get(req.params.id);
  if (!order) return res.redirect('/');
  const items = db.prepare('SELECT * FROM order_items WHERE order_id=?').all(order.id);
  res.send(V.confirmPage({ settings: settings(), order, items }));
});

/* ---------- admin ---------- */
function adminOk(req) {
  const raw = req.headers.cookie?.split(';').map((s) => s.trim()).find((s) => s.startsWith('adm='));
  const token = setting('admin_token', '');
  return raw && token && raw.slice(4) === token;
}
const requireAdmin = (req, res, next) => adminOk(req) ? next() : res.redirect('/admin/login');

app.get('/admin/login', (req, res) => res.send(V.admLogin()));
app.post('/admin/login', (req, res) => {
  const expected = process.env.ADMIN_PASSWORD || setting('admin_password', 'admin123');
  if (req.body.password === expected) {
    const token = setting('admin_token', '') || newAdminToken();
    res.setHeader('Set-Cookie', `adm=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 14}`);
    res.redirect('/admin');
  } else {
    res.status(401).send(V.admLogin('كلمة السر مش صحيحة'));
  }
});
app.get('/admin/logout', (req, res) => {
  res.setHeader('Set-Cookie', 'adm=; Path=/; Max-Age=0');
  res.redirect('/admin/login');
});

app.get('/admin', requireAdmin, (req, res) => {
  const stats = {
    products: db.prepare('SELECT COUNT(*) c FROM products WHERE active=1').get().c,
    orders: db.prepare('SELECT COUNT(*) c FROM orders').get().c,
    newOrders: db.prepare("SELECT COUNT(*) c FROM orders WHERE status='جديد'").get().c,
    revenue: db.prepare("SELECT COALESCE(SUM(total),0) s FROM orders WHERE status='تم التسليم'").get().s,
  };
  const latest = db.prepare('SELECT * FROM orders ORDER BY id DESC LIMIT 5').all();
  res.send(V.admDashboard({ stats, latest }));
});

app.get('/admin/products', requireAdmin, (req, res) => {
  res.send(V.admProducts(db.prepare('SELECT * FROM products ORDER BY id DESC').all(), req.query.ok));
});
app.get('/admin/products/new', requireAdmin, (req, res) => res.send(V.admProductForm(null)));
app.post('/admin/products/new', requireAdmin, upload.array('photos', 6), (req, res) => {
  const id = saveProduct(req, null);
  res.redirect(`/admin/products/${id}?ok=${encodeURIComponent('المنتج اتضاف')}`);
});
app.get('/admin/products/:id', requireAdmin, (req, res) => {
  const p = db.prepare('SELECT * FROM products WHERE id=?').get(req.params.id);
  if (!p) return res.redirect('/admin/products');
  res.send(V.admProductForm(p, req.query.ok));
});
app.post('/admin/products/:id', requireAdmin, upload.array('photos', 6), (req, res) => {
  saveProduct(req, parseInt(req.params.id, 10));
  res.redirect(`/admin/products/${req.params.id}?ok=${encodeURIComponent('اتحفظ')}`);
});
app.post('/admin/products/:id/delete', requireAdmin, (req, res) => {
  db.prepare('DELETE FROM products WHERE id=?').run(req.params.id);
  res.redirect(`/admin/products?ok=${encodeURIComponent('المتنج اتمسح')}`);
});

function saveProduct(req, id) {
  const b = req.body;
  const sizes = JSON.stringify(Array.isArray(b.sizes) ? b.sizes : b.sizes ? [b.sizes] : []);
  const data = {
    name: (b.name || '').trim(), brand: (b.brand || '').trim(), category: b.category || 'رجالي',
    price: Math.max(1, parseInt(b.price, 10) || 1), old_price: parseInt(b.old_price, 10) || null,
    description: (b.description || '').trim(), sizes, colors: '[]',
    stock: Math.max(0, parseInt(b.stock, 10) || 0), tint: b.tint || 't1', icon: b.category === 'حريمي' ? 'i-dress' : b.category === 'أولادي' ? 'i-kid' : 'i-tee',
    is_offer: b.is_offer ? 1 : 0, is_new: b.is_new ? 1 : 0, active: b.active ? 1 : 0,
  };
  let pid = id;
  if (id) {
    db.prepare(`UPDATE products SET name=@name,brand=@brand,category=@category,price=@price,old_price=@old_price,description=@description,sizes=@sizes,colors=@colors,stock=@stock,tint=@tint,icon=@icon,is_offer=@is_offer,is_new=@is_new,active=@active WHERE id=@id`).run({ ...data, id });
  } else {
    pid = db.prepare(`INSERT INTO products (name,brand,category,price,old_price,description,sizes,colors,stock,tint,icon,is_offer,is_new,active) VALUES (@name,@brand,@category,@price,@old_price,@description,@sizes,@colors,@stock,@tint,@icon,@is_offer,@is_new,@active)`).run(data).lastInsertRowid;
  }
  if (req.files?.length) {
    const ins = db.prepare('INSERT INTO product_photos (product_id,file,position) VALUES (?,?,?)');
    let pos = db.prepare('SELECT COALESCE(MAX(position),-1)+1 p FROM product_photos WHERE product_id=?').get(pid).p;
    for (const f of req.files) ins.run(pid, f.filename, pos++);
  }
  return pid;
}

app.get('/admin/orders', requireAdmin, (req, res) => {
  res.send(V.admOrders(db.prepare('SELECT * FROM orders ORDER BY id DESC').all()));
});
app.get('/admin/orders/:id', requireAdmin, (req, res) => {
  const o = db.prepare('SELECT * FROM orders WHERE id=?').get(req.params.id);
  if (!o) return res.redirect('/admin/orders');
  const items = db.prepare('SELECT * FROM order_items WHERE order_id=?').all(o.id);
  res.send(V.admOrderView(o, items, req.query.ok));
});
app.post('/admin/orders/:id/status', requireAdmin, (req, res) => {
  const ok = ['جديد', 'تم التأكيد', 'اتشحن', 'تم التسليم', 'ملغي'];
  if (ok.includes(req.body.status)) db.prepare('UPDATE orders SET status=? WHERE id=?').run(req.body.status, req.params.id);
  res.redirect(`/admin/orders/${req.params.id}?ok=${encodeURIComponent('الحالة اتحدثت')}`);
});

app.get('/admin/settings', requireAdmin, (req, res) => res.send(V.admSettings(settings(), req.query.ok)));
app.post('/admin/settings', requireAdmin, (req, res) => {
  for (const k of ['store_name', 'store_tagline', 'whatsapp', 'shipping_fee', 'transfer_info', 'hours'])
    if (req.body[k] !== undefined) setSetting.run(k, String(req.body[k]).trim());
  res.redirect(`/admin/settings?ok=${encodeURIComponent('الإعدادات اتحفظت')}`);
});
app.post('/admin/password', requireAdmin, (req, res) => {
  if ((req.body.password || '').length >= 6) {
    setSetting.run('admin_password', req.body.password);
    newAdminToken();
    res.setHeader('Set-Cookie', 'adm=; Path=/; Max-Age=0');
    return res.redirect('/admin/login');
  }
  res.redirect('/admin/settings');
});


/* dev-only screenshot helpers (never enabled in production) */
if (process.env.DEV_ROUTES === '1') {
  app.get('/dev/seed-cart', (req, res) => {
    writeCart(res, [{ id: 1, size: 'L', color: '#2b3a4a', qty: 1 }, { id: 2, size: 'XL', color: '#f3f3f3', qty: 1 }]);
    res.redirect(req.query.to || '/cart');
  });
  app.get('/dev/login', (req, res) => {
    const token = setting('admin_token', '') || newAdminToken();
    res.setHeader('Set-Cookie', `adm=${token}; Path=/; HttpOnly; SameSite=Lax`);
    res.redirect('/admin');
  });
}

const port = process.env.PORT || 3100;
app.listen(port, () => console.log(`Baba Saleh store on http://localhost:${port}`));
