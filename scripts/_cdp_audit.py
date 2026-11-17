"""Responsive audit via Chrome DevTools Protocol (true widths, no 500px clamp)."""
import asyncio
import json
import os
import subprocess
import tempfile
import time

import requests
import websockets

CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
URL = "file:///D:/Projects/portfolio/index.html"
PORT = 9333

AUDIT_JS = r"""
(() => {
  function box(el) { if (!el) return null; const r = el.getBoundingClientRect();
    return { t: Math.round(r.top), l: Math.round(r.left), r: Math.round(r.right),
      b: Math.round(r.bottom), w: Math.round(r.width), h: Math.round(r.height) }; }
  const vw = innerWidth, overflow = [], clipped = [], tiny = [];
  document.querySelectorAll("body *").forEach(el => {
    const cs = getComputedStyle(el);
    if (cs.visibility === "hidden" || cs.display === "none" || parseFloat(cs.opacity) === 0) return;
    if (el.closest(".hero-bg,.svg-sprite,.loader")) return;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return;
    if (r.right > vw + 1 || r.left < -1) overflow.push({ el: el.tagName.toLowerCase() + "." + String(el.className || "").trim().split(/\s+/).slice(0, 2).join("."), l: Math.round(r.left), r: Math.round(r.right) });
  });
  document.querySelectorAll("h1,h2,h3,h4,p,a,button,span,strong,dt,dd,li").forEach(el => {
    if (el.scrollWidth > el.clientWidth + 2 && getComputedStyle(el).overflow !== "visible")
      clipped.push({ tag: el.tagName, txt: el.textContent.trim().slice(0, 28), sw: el.scrollWidth, cw: el.clientWidth });
    const fs = parseFloat(getComputedStyle(el).fontSize);
    if (fs > 0 && fs < 11 && el.textContent.trim()) tiny.push({ tag: el.tagName, txt: el.textContent.trim().slice(0, 22), fs: fs.toFixed(1) });
  });
  const navLinks = Array.from(document.querySelectorAll(".nav-link")).map(box);
  return {
    vw, docW: document.documentElement.scrollWidth,
    overflow: overflow.slice(0, 8), clipped: clipped.slice(0, 6), tiny: tiny.slice(0, 6),
    nav: box(document.querySelector(".nav")), navLast: navLinks[7],
    navCta: box(document.querySelector(".nav-cta")),
    heroBtns: Array.from(document.querySelectorAll(".hero-actions .btn")).map(box),
    portrait: box(document.querySelector(".portrait-ring")),
    floatTop: box(document.querySelector(".floating-top")),
    floatBottom: box(document.querySelector(".floating-bottom"))
  };
})()
"""


def connect_ws(url):
    return websockets.connect(url, max_size=None, origin="http://localhost")


async def send(ws, method, params=None, cid=[0]):
    cid[0] += 1
    mid = cid[0]
    await ws.send(json.dumps({"id": mid, "method": method, "params": params or {}}))
    while True:
        msg = json.loads(await ws.recv())
        if msg.get("id") == mid:
            return msg


async def main():
    profile = os.path.join(tempfile.gettempdir(), "fy-cdp-profile")
    proc = subprocess.Popen([CHROME, "--headless=new", "--disable-gpu", "--no-first-run",
                             "--remote-allow-origins=*", "--remote-debugging-port=" + str(PORT),
                             "--user-data-dir=" + profile, "about:blank"],
                            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    try:
        for _ in range(60):
            try:
                targets = requests.get(f"http://127.0.0.1:{PORT}/json", timeout=1).json()
                page = next(t for t in targets if t["type"] == "page")
                break
            except Exception:
                time.sleep(0.25)
        else:
            raise RuntimeError("Chrome DevTools endpoint not ready")

        async with await connect_ws(page["webSocketDebuggerUrl"]) as ws:
            for width in (1920, 1440, 1024, 768, 425, 375, 320):
                await send(ws, "Emulation.setDeviceMetricsOverride", {
                    "width": width, "height": 900, "deviceScaleFactor": 1, "mobile": False})
                await send(ws, "Page.navigate", {"url": URL})
                await asyncio.sleep(1.6)
                res = await send(ws, "Runtime.evaluate", {
                    "expression": AUDIT_JS, "returnByValue": True})
                value = res.get("result", {}).get("result", {}).get("value")
                print("WIDTH", width, json.dumps(value, ensure_ascii=False))
    finally:
        proc.terminate()
        try:
            proc.wait(timeout=5)
        except Exception:
            proc.kill()


if __name__ == "__main__":
    asyncio.run(main())
