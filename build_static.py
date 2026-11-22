#!/usr/bin/env python3
"""Crawl the local Baba Saleh app and emit a static demo site under docs/."""
import os, re, shutil, subprocess, sys, time, urllib.parse, urllib.request

BASE = "http://localhost:3210"
OUT = "/downloads/babasaleh-store/docs"
PREFIX = "/babasaleh-store"

if os.path.exists(OUT):
    shutil.rmtree(OUT)
os.makedirs(OUT)

def fname(path):
    # map URL path to output-relative html filename
    if path in ("/", ""):
        return "index.html"
    p = path.lstrip("/")
    p = p.replace("?brand=", "__").replace("&", "_").replace("?", "_").replace("=", "-")
    if p == "admin/login":
        return "admin-login.html"
    return urllib.parse.unquote(p) + ".html"

SKIP = re.compile(r"^/(order/|uploads/|admin/(?!login)|cart/add|cart/update)")
seen, queue = set(), ["/"]
pages = {}

while queue:
    path = queue.pop(0)
    if path in seen or SKIP.match(path) or not path.startswith("/"):
        continue
    seen.add(path)
    try:
        with urllib.request.urlopen(BASE + urllib.parse.quote(path), timeout=10) as r:
            html = r.read().decode("utf-8")
    except Exception as e:
        print("FAIL", path, e); continue
    pages[path] = html
    for m in re.finditer(r'href="(/[^"#]*)"', html):
        h = urllib.parse.unquote(m.group(1))
        if h == "/style.css" or SKIP.match(h):
            continue
        if h not in seen and h not in queue:
            queue.append(h)

TOAST = """
<style>#demoToast{display:none;position:fixed;bottom:90px;inset-inline:16px;background:#7a5c00;color:#fff;padding:.9rem 1rem;border-radius:.7rem;text-align:center;z-index:9999;font-size:.9rem;line-height:1.6}</style>
<div id="demoToast">هذه نسخة معاينة للتصفح فقط — إضافة منتجات للسلة وإرسال الطلبات والبحث ولوحة التحكم وروابط واتساب غير مفعّلة هنا.</div>
<script>
function showDemoToast(e){if(e)e.preventDefault();var t=document.getElementById('demoToast');t.style.display='block';setTimeout(function(){t.style.display='none'},4000)}
document.addEventListener('submit',showDemoToast);
document.addEventListener('click',function(e){var a=e.target.closest('a[href^="https://wa.me"]');if(a)showDemoToast(e)});
</script>
"""

def rewrite(html):
    def rep(m):
        attr, val = m.group(1), m.group(2)
        if val == "/":
            return f'{attr}="{PREFIX}/"'
        if val == "/style.css":
            return f'{attr}="{PREFIX}/style.css"'
        if SKIP.match(val):
            return f'{attr}="#"'
        return f'{attr}="{PREFIX}/' + urllib.parse.quote(fname(val)) + '"'
    html = re.sub(r'(href|src)="(/[^"#]*)"', rep, html)
    html = html.replace('action="/search"', 'action="#"').replace('action="/cart/add"', 'action="#"').replace('action="/checkout"', 'action="#"').replace('action="/admin/login"', 'action="#"').replace('action="/cart/update"', 'action="#"')
    html = html.replace("</body>", TOAST + "</body>")
    return html

for path, html in pages.items():
    fn = os.path.join(OUT, fname(path))
    os.makedirs(os.path.dirname(fn), exist_ok=True)
    open(fn, "w", encoding="utf-8").write(rewrite(html))
    print("OK", path, "->", fname(path))

shutil.copy("/downloads/babasaleh-store/public/style.css", os.path.join(OUT, "style.css"))
print("pages:", len(pages))
