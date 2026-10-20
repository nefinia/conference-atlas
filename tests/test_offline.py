"""Service worker: the app and its data work offline, other pages are not replaced by the app."""
import time
from common import *
from playwright.sync_api import sync_playwright
check = Checker()
site = temp_site(); (site / "other.html").write_text('<!doctype html><title>second page</title><h1 id=x>Second page</h1>')
srv = serve(site, 8768); U = "http://localhost:8768/"
try:
    with sync_playwright() as p:
        b = p.chromium.launch(); ctx = b.new_context(viewport={"width": 375, "height": 740}); pg = ctx.new_page()
        pg.goto(U + "?sim=2027-05-10T11:30"); pg.wait_for_selector(".tabs button")
        pg.evaluate("navigator.serviceWorker.ready.then(()=>1)"); time.sleep(1.5)
        pg.reload(); pg.wait_for_selector(".tabs button"); time.sleep(0.8)
        check("service worker is controlling the page", pg.evaluate("!!navigator.serviceWorker.controller"))
        pg.goto(U + "other.html"); check("a second page is not replaced by the app", pg.inner_text("#x") == "Second page")
        pg.goto(U + "?sim=2027-05-10T11:30"); pg.wait_for_selector(".tabs button")
        ctx.set_offline(True)
        pg.goto(U + "?sim=2027-05-10T11:30"); pg.wait_for_selector(".tabs button", timeout=8000)
        check("app opens with no connection", "Open Horizons" in pg.title() and pg.locator(".tabs button").count() >= 8)
        pg.click('.tabs button:has-text("Programme")'); check("programme works offline", "Foundations I" in pg.inner_text("#view"))
        pg.click('button.star[data-id="t1"]'); check("starring works offline", pg.locator(".tabs .count").inner_text() == "1")
        ctx.set_offline(False); b.close()
finally:
    srv.terminate()
check.done()
