"""The app opens by double-click, with no server."""
from common import *
from playwright.sync_api import sync_playwright
check = Checker()
with sync_playwright() as p:
    pg = p.chromium.launch().new_page(viewport={"width": 375, "height": 740}); errs = []
    pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto("file://" + str(ROOT) + "/index.html?sim=2027-05-10T11:30"); pg.wait_for_timeout(1200)
    check("title comes from conference.js", "Open Horizons" in pg.title())
    pg.click("[data-tab=programme]"); pg.wait_for_timeout(300)
    check("programme shows talks", pg.locator(".item").count() > 5)
    pg.click("[data-act=star] >> nth=0"); pg.wait_for_timeout(200)
    check("starring works", pg.locator(".tabs .count").count() == 1)
    pg.goto("file://" + str(ROOT) + "/admin.html"); pg.wait_for_timeout(600)
    check("organiser page reads the time zone", pg.inner_text("#tz") == "Europe/Paris")
    check("no page errors", not errs, errs)
check.done()
