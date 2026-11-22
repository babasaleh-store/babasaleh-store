const DEMO_BANNER = `<div class="demo-banner">نسخة معاينة تجريبية للتصفح فقط — المنتجات والأسعار والطلبات بيانات تجريبية وليست حقيقية.</div>`;
// views.js - server-rendered Arabic RTL pages for Baba Saleh store
const AR_DIGITS = '٠١٢٣٤٥٦٧٨٩';
const ar = (v) => String(v).replace(/[0-9]/g, (d) => AR_DIGITS[+d]);
const money = (n) => `${ar(n)} ج.م`;
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));

const GOVS = ['القاهرة','الجيزة','الإسكندرية','الدقهلية','الشرقية','الغربية','المنوفية','القليوبية','البحيرة','كفر الشيخ','دمياط','بورسعيد','الإسماعيلية','السويس','الفيوم','بني سويف','المنيا','أسيوط','سوهاج','قنا','الأقصر','أسوان','البحر الأحمر','مطروح','شمال سيناء','جنوب سيناء','الوادي الجديد'];

const ICONS = `
<svg style="display:none">
  <symbol id="i-menu" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h10"/></symbol>
  <symbol id="i-cart" viewBox="0 0 24 24"><path d="M4 6h2l2.2 10.5a1.5 1.5 0 0 0 1.5 1.2h7.6a1.5 1.5 0 0 0 1.5-1.2L20.5 9H7"/><circle cx="10.5" cy="21" r=".6"/><circle cx="17" cy="21" r=".6"/></symbol>
  <symbol id="i-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/></symbol>
  <symbol id="i-arrow" viewBox="0 0 24 24"><path d="M19 12H5m6-6-6 6 6 6"/></symbol>
  <symbol id="i-tee" viewBox="0 0 24 24"><path fill="currentColor" stroke="none" d="M9 4 4 6.5 5.5 10 8 9v11h8V9l2.5 1L20 6.5 15 4a3 3 0 0 1-6 0z"/></symbol>
  <symbol id="i-dress" viewBox="0 0 24 24"><path fill="currentColor" stroke="none" d="M10 3h4l1 4-2 2 3 11H8l3-11-2-2z"/></symbol>
  <symbol id="i-kid" viewBox="0 0 24 24"><path fill="currentColor" stroke="none" d="M10 6 6 8l1 2.5L9 10v8h6v-8l2 .5L18 8l-4-2a2.5 2.5 0 0 1-4 0z"/></symbol>
  <symbol id="i-home" viewBox="0 0 24 24"><path d="m4 11 8-6 8 6v9h-6v-5h-4v5H4z"/></symbol>
  <symbol id="i-fire" viewBox="0 0 24 24"><path fill="currentColor" stroke="none" d="M12 3s5 4 5 9.5c0 1-.2 1.9-.6 2.7A4.7 4.7 0 0 1 12 21a5 5 0 0 1-5-5c0-2 1-3.6 2-4.7.6 1.2 1.6 1.7 1.6 1.7S10 9.5 12 3z"/></symbol>
  <symbol id="i-grid" viewBox="0 0 24 24"><rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/></symbol>
  <symbol id="i-user" viewBox="0 0 24 24"><circle cx="12" cy="8.5" r="3.5"/><path d="M5.5 20a6.5 6.5 0 0 1 13 0"/></symbol>
  <symbol id="i-truck" viewBox="0 0 24 24"><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z"/><circle cx="7" cy="18.5" r="1.6"/><circle cx="17" cy="18.5" r="1.6"/></symbol>
  <symbol id="i-swap" viewBox="0 0 24 24"><path d="M4 8h13l-3-3M20 16H7l3 3"/></symbol>
  <symbol id="i-cash" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="11" rx="2"/><circle cx="12" cy="12.5" r="2.6"/></symbol>
  <symbol id="i-wa" viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2zm5.1 13.6c-.2.6-1.2 1.1-1.7 1.2-.4.1-1 .1-1.6-.1-.4-.1-.9-.3-1.5-.5-2.6-1.1-4.3-3.8-4.4-4-.1-.2-1.1-1.4-1.1-2.7s.7-1.9 1-2.2c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .6l-.4.6c-.2.2-.3.4-.1.7.1.3.7 1.1 1.5 1.8 1 .9 1.9 1.2 2.2 1.3.3.1.5.1.6-.1l.8-1c.2-.2.4-.2.6-.1l1.9.9c.2.1.4.2.5.3 0 .1 0 .6-.2 1.1z"/></symbol>
  <symbol id="i-plus" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></symbol>
  <symbol id="i-minus" viewBox="0 0 24 24"><path d="M5 12h14"/></symbol>
  <symbol id="i-back" viewBox="0 0 24 24"><path d="M5 12h14m-6-6 6 6-6 6"/></symbol>
  <symbol id="i-sort" viewBox="0 0 24 24"><path d="M7 5v14m0 0-3-3m3 3 3-3M17 19V5m0 0-3 3m3-3 3 3"/></symbol>
  <symbol id="i-filter" viewBox="0 0 24 24"><path d="M4 6h16M7 12h10M10 18h4"/></symbol>
  <symbol id="i-check" viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5"/></symbol>
  <symbol id="i-phone" viewBox="0 0 24 24"><rect x="7" y="3" width="10" height="18" rx="2.5"/><path d="M11 18h2"/></symbol>
  <symbol id="i-down" viewBox="0 0 24 24"><path d="m6 10 6 6 6-6"/></symbol>
</svg>`;

const CATS = [
  { slug: 'رجالي', icon: 'i-tee', cls: 'c1' },
  { slug: 'حريمي', icon: 'i-dress', cls: 'c2' },
  { slug: 'أولادي', icon: 'i-kid', cls: 'c3' },
  { slug: 'بيتي', icon: 'i-home', cls: 'c4' },
  { slug: 'عروض', icon: 'i-fire', cls: 'c5' },
];

function waLink(settings, text) {
  return `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(text || 'السلام عليكم، عندي استفسار')}`;
}

function topbar(settings, cartCount) {
  return `<header class="topbar">
  <details class="menudd">
    <summary class="iconbtn"><svg class="ic"><use href="#i-menu"/></svg></summary>
    <div class="menu">
      <a href="/">الرئيسية</a>
      ${CATS.map((c) => `<a href="/c/${encodeURIComponent(c.slug)}">${c.slug === 'عروض' ? 'العروض' : 'قسم ' + esc(c.slug)}</a>`).join('')}
      <a href="${waLink(settings)}" target="_blank" rel="noopener">كلمنا واتساب</a>
    </div>
  </details>
  <nav class="toplinks"><a href="/c/%D8%B1%D8%AC%D8%A7%D9%84%D9%8A">رجالي</a><a href="/c/%D8%AD%D8%B1%D9%8A%D9%85%D9%8A">حريمي</a><a href="/c/%D8%A3%D9%88%D9%84%D8%A7%D8%AF%D9%8A">أولادي</a><a href="/c/%D8%A8%D9%8A%D8%AA%D9%8A">بيتي</a><a href="/c/%D8%B9%D8%B1%D9%88%D8%B6">العروض</a></nav><a class="logo" href="/"><b>${esc(settings.store_name)}</b><span>${esc(settings.store_tagline)}</span></a>
  <a class="iconbtn" href="/cart"><svg class="ic"><use href="#i-cart"/></svg>${cartCount ? `<span class="bdg">${ar(cartCount)}</span>` : ''}</a>
</header>`;
}

function bottomnav(active, cartCount) {
  const item = (href, icon, label, on) => `<a class="ni${on ? ' on' : ''}" href="${href}"><svg class="ic"><use href="#${icon}"/></svg><span>${label}</span></a>`;
  return `<nav class="bottomnav">
  ${item('/', 'i-home', 'الرئيسية', active === 'home')}
  ${item('/c/رجالي', 'i-grid', 'الأقسام', active === 'cats')}
  ${item('/cart', 'i-cart', 'السلة', active === 'cart')}
  ${item('/admin', 'i-user', 'حسابي', false)}
</nav>`;
}

function waFloat(settings) {
  return `<a class="wafloat" style="position:fixed;bottom:76px;inset-inline-start:16px" href="${waLink(settings)}" target="_blank" rel="noopener"><svg><use href="#i-wa"/></svg></a>`;
}

function layout(title, body, settings, active, cartCount) {
  return `<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/style.css"><title>${esc(title)} - ${esc(settings.store_name)}</title></head><body>
${ICONS}
${topbar(settings, cartCount)}
${DEMO_BANNER}
${body}
${waFloat(settings)}
${bottomnav(active, cartCount)}
<script>document.addEventListener('click',function(e){document.querySelectorAll('.menudd[open]').forEach(function(d){if(!d.contains(e.target))d.open=false})})</script>
</body></html>`;
}

function innerLayout(title, body, settings, active, cartCount) {
  return `<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/style.css"><title>${esc(title)} - ${esc(settings.store_name)}</title></head><body>
${ICONS}
<header class="pagehead">
  <a class="iconbtn" href="javascript:history.back()"><svg class="ic"><use href="#i-back"/></svg></a>
  <h1>${esc(title)}</h1>
  <a class="iconbtn" href="/cart"><svg class="ic"><use href="#i-cart"/></svg>${cartCount ? `<span class="bdg">${ar(cartCount)}</span>` : ''}</a>
</header>
${DEMO_BANNER}
${body}
${waFloat(settings)}
${bottomnav(active, cartCount)}
</body></html>`;
}

function prodCard(p) {
  const photo = p.photo;
  const off = p.old_price && p.old_price > p.price ? Math.round((1 - p.price / p.old_price) * 100) : 0;
  return `<div class="prod"><a class="ph ${photo ? 'hasimg' : p.tint}" href="/p/${p.id}">
    ${off ? `<span class="off">خصم ${ar(off)}٪</span>` : ''}
    ${photo ? `<img src="/uploads/${esc(photo)}" alt="${esc(p.name)}" loading="lazy">` : `<svg><use href="#${p.icon}"/></svg>`}</a>
    <div class="info"><h3><a href="/p/${p.id}">${esc(p.name)}${p.brand ? ` — ${esc(p.brand)}` : ''}</a></h3>
      <div class="pricerow"><span class="price">${money(p.price)}</span>${p.old_price ? `<span class="old">${ar(p.old_price)}</span>` : ''}
      <form method="post" action="/cart/add" style="margin-inline-start:auto"><input type="hidden" name="product_id" value="${p.id}"><button class="addbtn" aria-label="أضف للسلة"><svg class="ic"><use href="#i-plus"/></svg><span>أضف للسلة</span></button></form></div></div></div>`;
}

function home(data) {
  const { settings, offers, fresh, brands, cartCount } = data;
  const body = `
<div class="searchwrap"><a class="search" href="/search"><svg class="ic"><use href="#i-search"/></svg>دوّر على فانلة، طقم، ماركة…</a></div>
<div class="hero"><img class="heroimg" src="/assets/hero.jpg" alt="" loading="eager"><div class="heroov"></div>
  <div class="heroin"><span class="tag">وصل حديثًا</span>
  <h1>تشكيلة الشتاء وصلت</h1>
  <p>خصومات على دايس وقطونيل ولاسو — أطقم أصلية بخامات قطنية مريحة، والدفع عند الاستلام</p>
  <a class="cta" href="/c/عروض">اتفرّج على العروض<svg class="ic"><use href="#i-arrow"/></svg></a>
</div></div>
<div class="sec"><div class="sechead"><h2>أقسام المحل</h2></div>
  <div class="cats">${CATS.map((c) => `<a class="cat" href="/c/${encodeURIComponent(c.slug)}"><div class="circ ${c.cls}"><img class="catph" src="/assets/cat-${c.cls}.jpg" alt="" loading="lazy"></div><span>${c.slug}</span></a>`).join('')}</div>
</div>
<div class="sec"><div class="sechead"><h2>تسوّق بالماركة</h2></div>
  <div class="brands">${brands.map((b) => `<a class="chip" href="/brand/${encodeURIComponent(b)}">${esc(b)}</a>`).join('')}</div>
</div>
${offers.length ? `<div class="sec"><div class="sechead"><h2>عروض الأسبوع</h2><a href="/c/عروض">شوف الكل</a></div>
  <div class="grid">${offers.map(prodCard).join('')}</div></div>` : ''}
${fresh.length ? `<div class="sec"><div class="sechead"><h2>وصل حديثًا</h2></div>
  <div class="grid">${fresh.map(prodCard).join('')}</div></div>` : ''}
<div class="trust">
  <div class="ti"><svg class="ic"><use href="#i-swap"/></svg><span>استبدال خلال ١٤ يوم</span></div>
  <div class="ti"><svg class="ic"><use href="#i-truck"/></svg><span>شحن لكل المحافظات</span></div>
  <div class="ti"><svg class="ic"><use href="#i-cash"/></svg><span>الدفع عند الاستلام</span></div>
</div>
<div class="mfooter"><b>${esc(settings.store_name)} ${esc(settings.store_tagline)}</b><br>${esc(settings.hours)}<br>عندك سؤال؟ <a href="${waLink(settings)}" style="color:var(--green);font-weight:700">كلمنا واتساب</a> في أي وقت</div>`;
  return layout(settings.store_name, body, settings, 'home', cartCount);
}

function categoryPage(data) {
  const { settings, products, title, brands, activeBrand, cartCount } = data;
  const chips = [`<a class="chip${!activeBrand ? ' on' : ''}" href="/c/${encodeURIComponent(title)}">الكل</a>`]
    .concat(brands.map((b) => `<a class="chip${activeBrand === b ? ' on' : ''}" href="/c/${encodeURIComponent(title)}?brand=${encodeURIComponent(b)}">${esc(b)}</a>`)).join('');
  const body = `
<div class="chiprow">${chips}</div>
<div class="filterrow"><span class="count">${ar(products.length)} منتج</span></div>
<div class="sec"><div class="grid">${products.map(prodCard).join('')}</div>
${products.length === 0 ? '<div class="empty"><svg class="ic"><use href="#i-search"/></svg>مفيش منتجات هنا لسه</div>' : ''}</div>
<div style="height:18px"></div>`;
  return innerLayout(title, body, settings, 'cats', cartCount);
}

function productPage(data) {
  const { settings, p, photos, similar, cartCount } = data;
  const off = p.old_price && p.old_price > p.price ? Math.round((1 - p.price / p.old_price) * 100) : 0;
  const sizes = JSON.parse(p.sizes || '[]');
  const colors = JSON.parse(p.colors || '[]');
  const dots = photos.length > 1 ? `<div class="dots">${photos.map((_, i) => `<i class="${i === 0 ? 'on' : ''}"></i>`).join('')}</div>` : '';
  const body = `
<div class="pgal ${photos.length ? 'hasimg' : p.tint}">
  ${off ? `<span class="off">خصم ${ar(off)}٪</span>` : ''}
  ${photos.length ? `<img src="/uploads/${esc(photos[0].file)}" alt="${esc(p.name)}">` : `<svg><use href="#${p.icon}"/></svg>`}
  ${dots}
</div>
<div class="pbody">
  <h2 class="pname">${esc(p.name)}</h2>
  <div class="pbrand">${esc(p.brand)}${p.stock > 0 ? ` • متاح ${ar(p.stock)} قطعة` : ' • غير متاح حاليًا'}</div>
  <div class="ppricerow"><span class="pprice">${money(p.price)}</span>
    ${p.old_price ? `<span class="pold">${money(p.old_price)}</span><span class="psave">وفّر ${money(p.old_price - p.price)}</span>` : ''}</div>
  <form method="post" action="/cart/add">
  <input type="hidden" name="product_id" value="${p.id}">
  ${sizes.length ? `<div class="plabel">المقاس</div><div class="sizes">${sizes.map((s, i) => `<label class="size${i === 0 ? ' on' : ''}"><input type="radio" name="size" value="${esc(s)}" ${i === 0 ? 'checked' : ''} style="display:none">${esc(s)}</label>`).join('')}</div>` : ''}
  ${colors.length ? `<div class="plabel">اللون</div><div class="colors">${colors.map((c, i) => `<label><input type="radio" name="color" value="${esc(c)}" ${i === 0 ? 'checked' : ''} style="display:none"><span class="colr${i === 0 ? ' on' : ''}" style="background:${esc(c)}"></span></label>`).join('')}</div>` : ''}
  <div class="plabel">الكمية</div>
  <div class="qtyrow"><div class="qty"><button type="button" class="iconbtn" style="background:none;color:var(--navy);width:24px;height:24px" onclick="var i=this.parentNode.querySelector('input');i.value=Math.min(99,+i.value+1)"><svg class="ic"><use href="#i-plus"/></svg></button><input name="qty" value="1" readonly style="width:30px;border:none;background:none;text-align:center;font-weight:700;font-size:15px;padding:0"><button type="button" class="iconbtn" style="background:none;color:var(--navy);width:24px;height:24px" onclick="var i=this.parentNode.querySelector('input');i.value=Math.max(1,+i.value-1)"><svg class="ic"><use href="#i-minus"/></svg></button></div></div>
  <div class="ctas">
    <button class="btn-primary" type="submit"><svg class="ic"><use href="#i-cart"/></svg>أضف للسلة</button>
    <a class="btn-wa" href="${waLink(settings, 'السلام عليكم، عندي استفسار عن: ' + p.name)}" target="_blank" rel="noopener"><svg><use href="#i-wa"/></svg>اسأل عن المنتج واتساب</a>
  </div>
  </form>
  ${p.description ? `<div class="pcard"><h3>الوصف</h3><p>${esc(p.description)}</p></div>` : ''}
  <div class="pcard">
    <div class="prow"><svg class="ic"><use href="#i-truck"/></svg><span>شحن <b>${money(settings.shipping_fee)}</b> لكل المحافظات • التسليم خلال ٢ لـ ٤ أيام</span></div>
    <div class="prow"><svg class="ic"><use href="#i-swap"/></svg><span>استبدال المقاس خلال <b>١٤ يوم</b> من الاستلام</span></div>
  </div>
  ${similar.length ? `<div class="plabel" style="margin-top:6px">منتجات مشابهة</div><div class="similar">${similar.map(prodCard).join('')}</div>` : ''}
</div>
<script>document.querySelectorAll('.sizes label,.colors label').forEach(function(l){l.addEventListener('click',function(){l.parentElement.querySelectorAll('label').forEach(function(x){x.classList.remove('on')});l.classList.add('on')})});</script>`;
  return innerLayout('تفاصيل المنتج', body, settings, 'cats', cartCount);
}

function cartPage(data) {
  const { settings, items, subtotal, cartCount } = data;
  const body = items.length ? `
<div class="sec">${items.map((it) => `
  <div class="cartitem">
    <a class="th ${it.photo ? 'hasimg' : it.tint}" href="/p/${it.id}">${it.photo ? `<img src="/uploads/${esc(it.photo)}" alt="">` : `<svg><use href="#${it.icon}"/></svg>`}</a>
    <div class="ci">
      <h3>${esc(it.name)}${it.brand ? ` — ${esc(it.brand)}` : ''}</h3>
      <div class="meta">${it.size ? `مقاس ${esc(it.size)}` : ''}${it.color ? ` • لون` : ''}</div>
      <div class="crow"><span class="price">${money(it.price * it.qty)}</span>
        <form method="post" action="/cart/update" class="qty small" style="margin-inline-start:auto">
          <input type="hidden" name="key" value="${esc(it.key)}">
          <button name="delta" value="1" class="iconbtn" style="background:none;color:var(--navy);width:22px;height:22px"><svg class="ic"><use href="#i-plus"/></svg></button>
          <b>${ar(it.qty)}</b>
          <button name="delta" value="-1" class="iconbtn" style="background:none;color:var(--navy);width:22px;height:22px"><svg class="ic"><use href="#i-minus"/></svg></button>
        </form></div>
    </div>
  </div>`).join('')}</div>
<div class="sec"><div class="sumcard"><h3>ملخص الحساب</h3>
  <div class="sumrow"><span>إجمالي المنتجات (${ar(items.length)})</span><b>${money(subtotal)}</b></div>
  <div class="sumrow"><span>الشحن — يتحدد في الخطوة الجاية</span><b>${money(settings.shipping_fee)}</b></div>
  <div class="sumrow total"><span>الإجمالي النهائي</span><b>${money(subtotal + Number(settings.shipping_fee))}</b></div>
  <div class="nofees"><svg class="ic"><use href="#i-check"/></svg>اللي تشوفه هو اللي تدفعه — مفيش رسوم خفية</div>
</div></div>
<div class="sec" style="margin-bottom:24px"><a class="btn-primary" style="display:flex" href="/checkout"><svg class="ic"><use href="#i-check"/></svg>كمل الطلب</a></div>`
  : `<div class="empty"><svg class="ic"><use href="#i-cart"/></svg>السلة فاضية لسه<br><br><a class="btn-ghost" href="/">اتفرّج على المنتجات</a></div>`;
  return innerLayout('السلة', body, settings, 'cart', cartCount);
}

function checkoutPage(data) {
  const { settings, items, subtotal, cartCount, error, form } = data;
  const shipping = Number(settings.shipping_fee);
  const body = `
${error ? `<div class="flash-err">${esc(error)}</div>` : ''}
<div class="sec">
  <div class="sumcard"><h3>ملخص الحساب</h3>
    ${items.map((it) => `<div class="sumrow"><span>${esc(it.name)} × ${ar(it.qty)}</span><b>${money(it.price * it.qty)}</b></div>`).join('')}
    <div class="sumrow"><span>إجمالي المنتجات</span><b>${money(subtotal)}</b></div>
    <div class="sumrow"><span>الشحن</span><b>${money(shipping)}</b></div>
    <div class="sumrow total"><span>الإجمالي النهائي</span><b>${money(subtotal + shipping)}</b></div>
    <div class="nofees"><svg class="ic"><use href="#i-check"/></svg>اللي تشوفه هو اللي تدفعه — مفيش رسوم خفية</div>
  </div>
</div>
<div class="sec">
  <form class="pcard" method="post" action="/checkout" enctype="multipart/form-data">
    <h3>بيانات التوصيل</h3>
    <div class="field"><label>الاسم بالكامل</label><input type="text" name="name" required value="${esc(form?.name || '')}" placeholder="اكتب اسمك"></div>
    <div class="field"><label>رقم الموبايل</label><input type="tel" name="phone" required value="${esc(form?.phone || '')}" placeholder="01xxxxxxxxx" pattern="01[0-9]{9}" inputmode="numeric"></div>
    <div class="field"><label>المحافظة</label><select name="governorate" required><option value="">اختار المحافظة</option>${GOVS.map((g) => `<option${form?.governorate === g ? ' selected' : ''}>${g}</option>`).join('')}</select></div>
    <div class="field"><label>العنوان بالتفصيل</label><textarea name="address" required placeholder="الشارع، رقم العمارة، علامة مميزة">${esc(form?.address || '')}</textarea></div>
    <h3 style="margin-top:14px">طريقة الدفع</h3>
    <label class="payopt on"><input type="radio" name="payment" value="cod" checked style="display:none"><span class="rd"></span>
      <div class="pi"><b>كاش عند الاستلام</b><small>تدفع لمندوب الشحن لما توصلك الطلبية</small></div>
      <svg class="ic"><use href="#i-cash"/></svg></label>
    <label class="payopt"><input type="radio" name="payment" value="transfer" style="display:none"><span class="rd"></span>
      <div class="pi"><b>تحويل فودافون كاش أو انستاباي</b><small>${esc(settings.transfer_info)}</small></div>
      <svg class="ic"><use href="#i-phone"/></svg></label>
    <div class="field" style="margin-top:8px"><label>صورة التحويل (لو اخترت تحويل)</label><input type="file" name="receipt" accept="image/*"></div>
    <button class="btn-primary" style="width:100%;border:none;margin-top:10px" type="submit"><svg class="ic"><use href="#i-check"/></svg>تأكيد الطلب • ${money(subtotal + shipping)}</button>
  </form>
</div>
<script>document.querySelectorAll('.payopt input').forEach(function(r){r.addEventListener('change',function(){document.querySelectorAll('.payopt').forEach(function(x){x.classList.remove('on')});r.closest('.payopt').classList.add('on')})});</script>`;
  return innerLayout('إتمام الطلب', body, settings, 'cart', cartCount);
}

function confirmPage(data) {
  const { settings, order, items } = data;
  const body = `
<div class="confirm-hero">
  <div class="ok"><svg class="ic"><use href="#i-check"/></svg></div>
  <h1>طلبك وصلنا يا ${esc(order.customer_name.split(' ')[0])}!</h1>
  <p style="color:var(--ink2);font-size:13px">هنتواصل معاك على ${esc(order.phone)} لتأكيد الطلب قبل الشحن.</p>
  <div class="ordernum">طلب رقم ${esc(order.number)}</div>
</div>
<div class="sec"><div class="sumcard"><h3>تفاصيل الطلب</h3>
  ${items.map((it) => `<div class="sumrow"><span>${esc(it.name)}${it.size ? ` (${esc(it.size)})` : ''} × ${ar(it.qty)}</span><b>${money(it.price * it.qty)}</b></div>`).join('')}
  <div class="sumrow"><span>إجمالي المنتجات</span><b>${money(order.subtotal)}</b></div>
  <div class="sumrow"><span>الشحن — ${esc(order.governorate)}</span><b>${money(order.shipping)}</b></div>
  <div class="sumrow total"><span>الإجمالي النهائي</span><b>${money(order.total)}</b></div>
  <div class="sumrow"><span>الدفع</span><b>${order.payment === 'cod' ? 'كاش عند الاستلام' : 'تحويل'}</b></div>
</div></div>
<div class="sec" style="margin-bottom:24px"><a class="btn-wa" style="display:flex" href="${waLink(settings, 'السلام عليكم، عندي استفسار عن طلبي رقم ' + order.number)}" target="_blank" rel="noopener"><svg><use href="#i-wa"/></svg>تابع طلبك واتساب</a></div>`;
  return innerLayout('تم الطلب', body, settings, 'cart', 0);
}

/* ---------- admin ---------- */
function admLayout(title, body, active) {
  const link = (href, label, key) => `<a class="${active === key ? 'on' : ''}" href="${href}">${label}</a>`;
  return `<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/style.css"><title>${esc(title)} - لوحة التحكم</title></head><body>
${ICONS}<div class="adm">
<div class="adm-top"><b>لوحة تحكم ${esc(title)}</b><span style="margin-inline-start:auto"></span><a href="/" target="_blank">المتجر ↗</a><a href="/admin/logout">خروج</a></div>
<div class="adm-nav">${link('/admin', 'الرئيسية', 'dash')}${link('/admin/products', 'المنتجات', 'products')}${link('/admin/orders', 'الطلبات', 'orders')}${link('/admin/settings', 'الإعدادات', 'settings')}</div>
<div class="demo-banner">وضع المعاينة التجريبية: البيانات قد تُحذف عند إعادة تشغيل الاستضافة المجانية — لا تضف منتجاتك الحقيقية هنا بعد.</div>
${body}</div></body></html>`;
}

function admDashboard(data) {
  const { stats, latest } = data;
  const badge = (s) => `<span class="badge ${s === 'جديد' ? 'b-new' : s === 'تم التسليم' ? 'b-done' : s === 'ملغي' ? 'b-cancel' : 'b-prog'}">${esc(s)}</span>`;
  const body = `<div class="adm-sec">
  <div class="stats">
    <div class="stat"><b>${ar(stats.products)}</b><span>منتج</span></div>
    <div class="stat"><b>${ar(stats.newOrders)}</b><span>طلب جديد</span></div>
    <div class="stat"><b>${ar(stats.orders)}</b><span>كل الطلبات</span></div>
    <div class="stat"><b>${money(stats.revenue)}</b><span>مبيعات مسلّمة</span></div>
  </div>
  <div style="height:16px"></div>
  <div class="adm-card"><h2>أحدث الطلبات</h2>
  ${latest.length ? `<table class="tbl"><tr><th>رقم</th><th>العميل</th><th>الإجمالي</th><th>الحالة</th></tr>
    ${latest.map((o) => `<tr><td><a href="/admin/orders/${o.id}">${esc(o.number)}</a></td><td>${esc(o.customer_name)}</td><td>${money(o.total)}</td><td>${badge(o.status)}</td></tr>`).join('')}</table>`
    : '<p style="color:var(--ink2);font-size:13px">لسه مفيش طلبات.</p>'}</div></div>`;
  return admLayout('بابا صالح', body, 'dash');
}

function admProducts(products, flash) {
  const body = `<div class="adm-sec">
  ${flash ? `<div class="flash-ok" style="margin:0 0 12px">${esc(flash)}</div>` : ''}
  <a class="btn-form" style="display:block;text-align:center;margin-bottom:14px" href="/admin/products/new">+ إضافة منتج جديد</a>
  <table class="tbl"><tr><th>المنتج</th><th>الماركة</th><th>السعر</th><th>المخزون</th><th></th></tr>
  ${products.map((p) => `<tr><td><a href="/admin/products/${p.id}">${esc(p.name)}</a>${p.is_offer ? ' <span class="badge b-prog">عرض</span>' : ''}${p.is_new ? ' <span class="badge b-new">جديد</span>' : ''}${!p.active ? ' <span class="badge b-cancel">مخفي</span>' : ''}</td>
    <td>${esc(p.brand)}</td><td>${money(p.price)}</td><td>${ar(p.stock)}</td>
    <td><a href="/admin/products/${p.id}">تعديل</a></td></tr>`).join('')}</table></div>`;
  return admLayout('المنتجات', body, 'products');
}

function admProductForm(p, flash) {
  const isNew = !p;
  p = p || { name:'', brand:'', category:'رجالي', price:'', old_price:'', description:'', sizes:'["M","L","XL","2XL","3XL"]', colors:'[]', stock:10, tint:'t1', icon:'i-tee', is_offer:0, is_new:0, active:1 };
  const sizes = JSON.parse(p.sizes || '[]');
  const body = `<div class="adm-sec">
  ${flash ? `<div class="flash-ok" style="margin:0 0 12px">${esc(flash)}</div>` : ''}
  <form class="adm-card" method="post" action="${isNew ? '/admin/products/new' : `/admin/products/${p.id}`}" enctype="multipart/form-data">
    <h2>${isNew ? 'منتج جديد' : 'تعديل: ' + esc(p.name)}</h2>
    <div class="field"><label>اسم المنتج</label><input type="text" name="name" required value="${esc(p.name)}"></div>
    <div class="frow">
      <div class="field"><label>الماركة</label><input type="text" name="brand" value="${esc(p.brand)}" placeholder="دايس، قطونيل…"></div>
      <div class="field"><label>القسم</label><select name="category">${['رجالي','حريمي','أولادي','بيتي'].map((c) => `<option${p.category === c ? ' selected' : ''}>${c}</option>`).join('')}</select></div>
    </div>
    <div class="frow">
      <div class="field"><label>السعر (ج.م)</label><input type="number" name="price" required min="1" value="${p.price}"></div>
      <div class="field"><label>السعر قبل الخصم (اختياري)</label><input type="number" name="old_price" min="0" value="${p.old_price || ''}"></div>
    </div>
    <div class="frow">
      <div class="field"><label>المخزون</label><input type="number" name="stock" min="0" value="${p.stock}"></div>
      <div class="field"><label>لون العرض المؤقت</label><select name="tint">${['t1','t2','t3','t4','t5','t6'].map((t) => `<option${p.tint === t ? ' selected' : ''}>${t}</option>`).join('')}</select></div>
    </div>
    <div class="field"><label>المقاسات المتاحة</label><div class="checks">${['M','L','XL','2XL','3XL','4XL','فري'].map((s) => `<label><input type="checkbox" name="sizes" value="${s}"${sizes.includes(s) ? ' checked' : ''}>${s}</label>`).join('')}</div></div>
    <div class="field"><label>الوصف</label><textarea name="description">${esc(p.description)}</textarea></div>
    <div class="field"><label>صور المنتج (ممكن تختار كام صورة)</label><input type="file" name="photos" accept="image/*" multiple></div>
    <div class="checks" style="margin-bottom:12px">
      <label><input type="checkbox" name="is_offer" value="1"${p.is_offer ? ' checked' : ''}>عرض</label>
      <label><input type="checkbox" name="is_new" value="1"${p.is_new ? ' checked' : ''}>جديد</label>
      <label><input type="checkbox" name="active" value="1"${p.active ? ' checked' : ''}>ظاهر في المتجر</label>
    </div>
    <button class="btn-form" type="submit">${isNew ? 'إضافة المنتج' : 'حفظ التعديلات'}</button>
  </form>
  ${!isNew ? `<form class="adm-card" method="post" action="/admin/products/${p.id}/delete" onsubmit="return confirm('متأكد إنك عايز تمسح المنتج ده؟')"><button class="btn-danger" type="submit">مسح المنتج</button></form>` : ''}</div>`;
  return admLayout(isNew ? 'منتج جديد' : 'تعديل منتج', body, 'products');
}

function admOrders(orders) {
  const badge = (s) => `<span class="badge ${s === 'جديد' ? 'b-new' : s === 'تم التسليم' ? 'b-done' : s === 'ملغي' ? 'b-cancel' : 'b-prog'}">${esc(s)}</span>`;
  const body = `<div class="adm-sec">
  ${orders.length ? `<table class="tbl"><tr><th>رقم</th><th>العميل</th><th>المحافظة</th><th>الإجمالي</th><th>الحالة</th><th>التاريخ</th></tr>
  ${orders.map((o) => `<tr><td><a href="/admin/orders/${o.id}">${esc(o.number)}</a></td><td>${esc(o.customer_name)}</td><td>${esc(o.governorate)}</td><td>${money(o.total)}</td><td>${badge(o.status)}</td><td>${esc(o.created_at.slice(0, 10))}</td></tr>`).join('')}</table>`
  : '<div class="empty"><svg class="ic"><use href="#i-cart"/></svg>لسه مفيش طلبات — أول ما عميل يطلب هيظهر هنا.</div>'}</div>`;
  return admLayout('الطلبات', body, 'orders');
}

function admOrderView(order, items, flash) {
  const body = `<div class="adm-sec">
  ${flash ? `<div class="flash-ok" style="margin:0 0 12px">${esc(flash)}</div>` : ''}
  <div class="orderbox">
    <div class="oline"><b>طلب ${esc(order.number)}</b><span>${esc(order.created_at)}</span></div>
    <div class="oline"><span>العميل</span><b>${esc(order.customer_name)}</b></div>
    <div class="oline"><span>الموبايل</span><b><a href="tel:${esc(order.phone)}" dir="ltr">${esc(order.phone)}</a> • <a href="https://wa.me/2${esc(order.phone)}" target="_blank" rel="noopener">واتساب</a></b></div>
    <div class="oline"><span>العنوان</span><b>${esc(order.governorate)} — ${esc(order.address)}</b></div>
    <div class="oline"><span>الدفع</span><b>${order.payment === 'cod' ? 'كاش عند الاستلام' : 'تحويل'}</b></div>
    ${order.receipt_file ? `<div class="oline"><span>صورة التحويل</span><b><a href="/uploads/${esc(order.receipt_file)}" target="_blank">فتح الصورة</a></b></div>` : ''}
  </div>
  <div class="orderbox">
    ${items.map((it) => `<div class="oline"><span>${esc(it.name)}${it.size ? ` (${esc(it.size)})` : ''} × ${ar(it.qty)}</span><b>${money(it.price * it.qty)}</b></div>`).join('')}
    <div class="oline"><span>إجمالي المنتجات</span><b>${money(order.subtotal)}</b></div>
    <div class="oline"><span>الشحن</span><b>${money(order.shipping)}</b></div>
    <div class="oline" style="border-top:1px dashed var(--hair);padding-top:8px"><span><b>الإجمالي</b></span><b>${money(order.total)}</b></div>
  </div>
  <form class="adm-card" method="post" action="/admin/orders/${order.id}/status">
    <h2>حالة الطلب</h2>
    <div class="checks">${['جديد','تم التأكيد','اتشحن','تم التسليم','ملغي'].map((s) => `<label><input type="radio" name="status" value="${s}"${order.status === s ? ' checked' : ''}>${s}</label>`).join('')}</div>
    <button class="btn-form" style="margin-top:12px" type="submit">حفظ الحالة</button>
  </form></div>`;
  return admLayout(`طلب ${order.number}`, body, 'orders');
}

function admSettings(s, flash) {
  const body = `<div class="adm-sec">
  ${flash ? `<div class="flash-ok" style="margin:0 0 12px">${esc(flash)}</div>` : ''}
  <form class="adm-card" method="post" action="/admin/settings">
    <h2>بيانات المحل</h2>
    <div class="frow">
      <div class="field"><label>اسم المحل</label><input type="text" name="store_name" value="${esc(s.store_name)}"></div>
      <div class="field"><label>السطر التعريفي</label><input type="text" name="store_tagline" value="${esc(s.store_tagline)}"></div>
    </div>
    <div class="frow">
      <div class="field"><label>رقم الواتساب (بكود الدولة، مثال: 201xxxxxxxxx)</label><input type="text" name="whatsapp" value="${esc(s.whatsapp)}" dir="ltr"></div>
      <div class="field"><label>سعر الشحن (ج.م)</label><input type="number" name="shipping_fee" min="0" value="${esc(s.shipping_fee)}"></div>
    </div>
    <div class="field"><label>بيانات التحويل (تظهر للعميل عند اختيار تحويل)</label><input type="text" name="transfer_info" value="${esc(s.transfer_info)}"></div>
    <div class="field"><label>مواعيد المحل</label><input type="text" name="hours" value="${esc(s.hours)}"></div>
    <button class="btn-form" type="submit">حفظ الإعدادات</button>
  </form>
  <form class="adm-card" method="post" action="/admin/password">
    <h2>كلمة سر اللوحة</h2>
    <div class="field"><label>كلمة سر جديدة</label><input type="password" name="password" required minlength="6"></div>
    <button class="btn-form" type="submit">تغيير كلمة السر</button>
  </form></div>`;
  return admLayout('الإعدادات', body, 'settings');
}

function admLogin(error) {
  return `<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/style.css"><title>دخول لوحة التحكم</title></head><body>
${ICONS}
<form class="loginwrap" method="post" action="/admin/login">
  <h1>لوحة تحكم بابا صالح</h1>
  ${error ? `<div class="flash-err" style="margin:0 0 12px">${esc(error)}</div>` : ''}
  <div class="field"><label>كلمة السر</label><input type="password" name="password" required autofocus></div>
  <button class="btn-form" type="submit">دخول</button>
</form></body></html>`;
}

function searchPage(data) {
  const { settings, q, products, cartCount } = data;
  const body = `
<div class="searchwrap"><form class="search" method="get" action="/search"><svg class="ic"><use href="#i-search"/></svg><input type="text" name="q" value="${esc(q)}" placeholder="دوّر على فانلة، طقم، ماركة…" style="border:none;background:none;flex:1;padding:0"></form></div>
<div class="sec"><div class="sechead"><h2>${q ? `نتايج البحث عن «${esc(q)}»` : 'ابحث في المتجر'}</h2></div>
<div class="grid">${products.map(prodCard).join('')}</div>
${q && !products.length ? '<div class="empty"><svg class="ic"><use href="#i-search"/></svg>مفيش نتايج — جرّب كلمة تانية</div>' : ''}</div>`;
  return innerLayout('بحث', body, settings, 'cats', cartCount);
}

module.exports = { ar, money, esc, home, categoryPage, productPage, cartPage, checkoutPage, confirmPage, searchPage, admLayout, admDashboard, admProducts, admProductForm, admOrders, admOrderView, admSettings, admLogin };
