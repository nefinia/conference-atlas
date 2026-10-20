import os, sys, time, json, tempfile
from common import *
from playwright.sync_api import sync_playwright
ok=lambda n,c:print(("PASS " if c else "FAIL ")+n)
with sync_playwright() as p:
    b=p.chromium.launch(); ctx=b.new_context(accept_downloads=True); pg=ctx.new_page(); errs=[]; pg.on("pageerror",lambda e:errs.append(str(e)))
    pg.goto("file://"+str(ROOT)+"/admin.html"); pg.wait_for_timeout(500)
    pg.click("#local"); pg.wait_for_timeout(300)
    ok("editors shown, server parts hidden", pg.is_visible("#addAnn") and not pg.is_visible("#summary") and not pg.is_visible("#feedback"))
    pg.click("#addAnn"); pg.fill("[data-f=text]","Lunch is in the <b>Foyer</b>")
    pg.click("#addChg"); pg.check("[data-f=cancelled]")
    with pg.expect_download() as d: pg.click("#publish")
    j=json.load(open(d.value.path())); ok("file name live.json", d.value.suggested_filename=="live.json")
    ok("announcement and cancel in file", j["announcements"][0]["text"].startswith("Lunch") and list(j["changes"].values())[0].get("cancelled") and j["updated"])
    ok("no errors", not errs)
