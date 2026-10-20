import os, sys, time, json, tempfile
from common import *
from playwright.sync_api import sync_playwright
U="file://"+str(ROOT)+"/index.html?sim=2027-05-10T11:30"
ok=lambda n,c:print(("PASS " if c else "FAIL ")+n)
with sync_playwright() as p:
    b=p.chromium.launch(); ctx=b.new_context(viewport={"width":375,"height":740},accept_downloads=True); pg=ctx.new_page(); errs=[]
    pg.on("pageerror",lambda e:errs.append(str(e))); pg.on("dialog",lambda d:d.accept())
    pg.goto(U); pg.wait_for_timeout(800)
    pg.click("[data-tab=saved]"); pg.click("[data-seg=notes]")
    ok("empty hint + new note button", pg.locator("[data-act=new-note]").count()==1)
    pg.click("[data-act=new-note]"); ok("textarea appears and is focused", pg.evaluate("document.activeElement.dataset.fnote!==undefined"))
    pg.keyboard.type("Ask Ada about shared vocabularies"); pg.wait_for_timeout(700)
    pg.click("[data-act=new-note]"); pg.keyboard.type("Dinner idea: ramen"); pg.wait_for_timeout(700)
    ok("two notes", pg.locator("[data-fnote]").count()==2)
    ok("no stars needed, download enabled", pg.locator("[data-act=export-notes]").is_disabled()==False)
    pg.reload(); pg.wait_for_timeout(800); pg.click("[data-tab=saved]"); pg.click("[data-seg=notes]")
    vals=pg.eval_on_selector_all("[data-fnote]","e=>e.map(x=>x.value)")
    ok("notes survive reload",sorted(vals)==["Ask Ada about shared vocabularies","Dinner idea: ramen"])
    with pg.expect_download() as d: pg.click("[data-act=export-notes]")
    path=d.value.path(); md=open(path).read(); ok("markdown has free notes","Ask Ada about shared" in md and "Dinner idea" in md)
    pg.click("[data-act=del-note] >> nth=0"); pg.wait_for_timeout(300)
    ok("one deleted",pg.locator("[data-fnote]").count()==1)
    # talk note still works
    pg.click("[data-tab=programme]"); pg.click("[data-act=open] >> nth=0"); pg.fill("[data-note]","about a talk"); pg.wait_for_timeout(700)
    pg.click("[data-tab=saved]"); pg.click("[data-seg=notes]")
    t=pg.inner_text("#view"); ok("talk note shown under its heading","Notes on talks" in t and "about a talk" in t)
    ok("no page errors",not errs)
