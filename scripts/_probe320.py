"""One-off CDP probe for narrow-width overflow diagnosis."""
import asyncio
import json
import os
import subprocess
import tempfile
import time

import requests
import websockets

CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
PORT = 9444
URL = "file:///D:/Projects/portfolio/index.html"

EXPR = r"""
(() => {
  const vw = innerWidth;
  const rows = [];
  document.querySelectorAll('body *').forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.width === 0) return;
    if (r.right > vw + 1) {
      const cs = getComputedStyle(el);
      rows.push({
        el: el.tagName.toLowerCase() + '.' + String(el.className || '').trim().split(/\s+/).join('.'),
        l: Math.round(r.left), r: Math.round(r.right), w: Math.round(r.width),
        sw: el.scrollWidth, cw: el.clientWidth,
        text: (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 60),
        display: cs.display, minW: cs.minWidth
      });
    }
  });
  return { vw, docW: document.documentElement.scrollWidth, rows: rows.slice(0, 30) };
})()
"""


async def main():
    profile = os.path.join(tempfile.gettempdir(), "fy-probe320")
    proc = subprocess.Popen([CHROME, "--headless=new", "--disable-gpu", "--no-first-run",
                             "--remote-allow-origins=*", "--remote-debugging-port=" + str(PORT),
                             "--user-data-dir=" + profile, "about:blank"],
                            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    try:
        for _ in range(60):
            try:
                target = next(t for t in requests.get(f"http://127.0.0.1:{PORT}/json", timeout=1).json()
                              if t["type"] == "page")
                break
            except Exception:
                time.sleep(0.25)
        async with await websockets.connect(target["webSocketDebuggerUrl"], max_size=None,
                                            origin="http://localhost") as ws:
            cid = [0]

            async def send(method, params=None):
                cid[0] += 1
                mid = cid[0]
                await ws.send(json.dumps({"id": mid, "method": method, "params": params or {}}))
                while True:
                    msg = json.loads(await ws.recv())
                    if msg.get("id") == mid:
                        return msg

            await send("Emulation.setDeviceMetricsOverride",
                       {"width": 320, "height": 900, "deviceScaleFactor": 1, "mobile": False})
            await send("Page.navigate", {"url": URL})
            await asyncio.sleep(1.5)
            res = await send("Runtime.evaluate", {"expression": EXPR, "returnByValue": True})
            print(json.dumps(res["result"]["result"]["value"], indent=2))
    finally:
        proc.terminate()
        try:
            proc.wait(timeout=5)
        except Exception:
            proc.kill()


if __name__ == "__main__":
    asyncio.run(main())
