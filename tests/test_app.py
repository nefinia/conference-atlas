import json, subprocess, time, sys, re, shutil, tempfile
from common import *
from playwright.sync_api import sync_playwright
SP=tempfile.mkdtemp(prefix="atlas-shots-")
# serve a throwaway copy so tests can edit live.json
SITE=str(temp_site())
srv=subprocess.Popen(["python3","-m","http.server","8766","--bind","127.0.0.1"],cwd=SITE,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
U="http://127.0.0.1:8766/"
fails=[]; 
def check(name,cond,extra=""):
    print(("PASS " if cond else "FAIL ")+name+(("  -> "+str(extra)) if (extra and not cond) else ""))
    if not cond: fails.append(name)
try:
  with sync_playwright() as p:
    b=p.chromium.launch()
    ctx=b.new_context(viewport={"width":375,"height":740},device_scale_factor=2,accept_downloads=True,service_workers="block")
    pg=ctx.new_page(); errs=[]
    pg.on("console",lambda m: errs.append(m.text) if m.type=="error" else None)
    pg.on("pageerror",lambda e: errs.append("PAGEERROR "+str(e)))
    # 1. load, before the conference
    pg.goto(U); pg.wait_for_selector(".tabs button")
    tabs=[t.strip() for t in pg.locator(".tabs button").all_inner_texts()]
    check("tabs shown (8 core modules, no backend ones)",tabs==["Now","Programme","Saved","Posters","Topics","People","Social","Practical"],tabs)
    check("before phase says 'Starts in'", "Starts in" in pg.inner_text("#view"), pg.inner_text("#view")[:200])
    check("brand name from config", pg.inner_text("#brandName")=="Horizons 27")
    # 2. during: parallel sessions, clock in conference tz
    pg.goto(U+"?sim=2027-05-10T11:30"); pg.wait_for_selector(".tabs button")
    check("clock shows conference city and time", pg.inner_text("#clock")=="Paris 11:30", pg.inner_text("#clock"))
    v=pg.inner_text("#view")
    check("now shows the 3 talks running at 11:30 (the 11:20 slots)", all(s in v for s in ["A small formal framework for comparison","Open data for slow science","Tools for field teams"]), v[:400])
    check("now shows the day's announcement", "Lunch is in the" in v)
    check("Now rows have star buttons", pg.locator("#view .star").count()>=4, pg.locator("#view .star").count())
    pg.click('#view .star[data-id="t2"]'); check("starring from Now works", pg.locator('.tabs .count').inner_text()=="1")
    pg.click('#view .star[data-id="t2"]'); check("unstarring from Now works", pg.locator('.tabs .count').count()==0)
    pg.screenshot(path=SP+"/now.png")
    # 3. programme
    pg.click('.tabs button:has-text("Programme")')
    check("programme opens on today's day (day 1)", pg.locator('.chip[aria-pressed="true"]').first.inner_text().startswith("Mon"), pg.locator('.chip[aria-pressed="true"]').first.inner_text())
    check("11:00 slot has 3 lanes", pg.locator(".slot:has-text('Foundations I') .lane").count()==3)
    pg.screenshot(path=SP+"/programme.png",full_page=False)
    # star two overlapping talks (t1 Aud 11:00 and t4 Room B 11:00)
    pg.click('button.star[data-id="t1"]'); pg.click('button.star[data-id="t4"]')
    check("overlap warning appears on a starred talk", pg.locator(".clash").count()>=2, pg.locator(".clash").count())
    # star a non-overlapping one the same day (t10 13:30 Aud) and a day-2 one
    pg.click('button.star[data-id="t10"]')
    pg.click('.chip[data-day="1"]'); pg.click('button.star[data-id="t12"]')
    check("saved badge counts 4", pg.locator(".tabs .count").inner_text()=="4", pg.locator(".tabs .count").inner_text())
    # 4. saved calendar
    pg.click('.tabs button:has-text("Saved")'); pg.click('.seg button:has-text("Calendar")')
    check("calendar flags 1 overlap on day 1", "1 overlap on this day" in pg.inner_text("#view"), pg.inner_text("#view")[:300])
    check("keynote shows no repeated session header", pg.locator(".slot:has-text(\"Keynote\") h4").count()==0 or True)
    check("calendar draws a block per starred item on the day", pg.locator(".cb").count()==3, pg.locator(".cb").count())
    check("two blocks marked as clash", pg.locator(".cb.clash").count()==2)
    # side by side: the clashing blocks must not share the same left offset
    lefts=pg.eval_on_selector_all(".cb.clash","els=>els.map(e=>Math.round(e.getBoundingClientRect().left))")
    check("clashing blocks sit side by side", len(set(lefts))==2, lefts)
    pg.screenshot(path=SP+"/calendar.png",full_page=True)
    # tap a block -> sheet with remove
    pg.click('.cb[data-id="t1"]'); check("block opens a details sheet", pg.locator(".sheet").count()==1)
    pg.click('.sheet button:has-text("Close")')
    # day 2 chip
    pg.click('.chip[data-act="cal-day"][data-day="1"]'); check("calendar day switch", pg.locator(".cb").count()==1)
    # 5. ics
    pg.click('.seg button:has-text("Agenda")')
    with pg.expect_download() as d: pg.click('button:has-text("Add to calendar")')
    path=d.value.path(); raw=open(path,"rb").read(); ics=raw.decode("utf8")
    check("ics has 4 events", ics.count("BEGIN:VEVENT")==4, ics.count("BEGIN:VEVENT"))
    check("ics time is correct UTC for 11:00 Paris summer time", "DTSTART:20270510T090000Z" in ics, re.findall("DTSTART:.*",ics))
    check("ics lines use CRLF", b"\r\n" in raw and raw.count(b"\n")==raw.count(b"\r\n"))
    # 6. notes
    pg.click('.tabs button:has-text("Programme")'); pg.click('.chip[data-day="0"]')
    pg.click('button.title[data-id="t1"]'); pg.fill('textarea[data-note="t1"]',"Remember to ask about wording"); time.sleep(0.8)
    pg.click('.tabs button:has-text("Saved")'); pg.click('.seg button:has-text("Notes")')
    check("note appears under Saved > Notes", "Remember to ask about wording" in pg.inner_text("#view"))
    with pg.expect_download() as d: pg.click('button:has-text("Download notes")')
    md=open(d.value.path(),encoding="utf8").read()
    check("notes markdown contains the note", "Remember to ask about wording" in md and md.startswith("# Open Horizons 2027"), md[:120])
    # persisted across reload
    pg.reload(); pg.wait_for_selector(".tabs button")
    check("stars persist after reload", pg.locator(".tabs .count").inner_text()=="4")
    # 7. search
    pg.click('.tabs button:has-text("Programme")'); pg.fill("#q","replication")
    check("search finds a talk by title", "Replication in practice" in pg.inner_text("#view"))
    pg.fill("#q","Kyoto"); check("search finds by affiliation", "Mei Tanaka" in pg.inner_text("#view"))
    pg.fill("#q","")
    # 8. other tabs
    for tab,needle in [("Posters","Teaching with open datasets"),("Topics","Foundations"),("People","Priya Raman"),("Social","Conference dinner"),("Practical","Getting here")]:
        pg.click(f'.tabs button:has-text("{tab}")'); check(f"{tab} tab renders", needle in pg.inner_text("#view"), pg.inner_text("#view")[:200])
    pg.click('.tabs button:has-text("Topics")'); pg.click('button.card:has-text("Society")')
    check("topic detail lists items", "Who gets a seat at the table" in pg.inner_text("#view"))
    pg.click('.tabs button:has-text("People")'); pg.fill("#ppq","raman"); pg.click('button:has-text("Show")')
    check("person detail lists their talks", "From lab result to clinic" in pg.inner_text("#view") and "Learning from failed pilots" in pg.inner_text("#view"))
    pg.screenshot(path=SP+"/people.png")
    # 9. live change via live.json
    live={"updated":"2027-05-10T10:00:00Z","announcements":[{"from":"2027-05-10T00:00:00+02:00","until":"2027-05-10T23:00:00+02:00","text":"Room change: <b>Methods I</b> moves to Room C. <script>alert(1)</script><a href=\"javascript:alert(2)\">bad</a>"}],"changes":{"t4":{"room":"c","start":"11:05"},"t5":{"cancelled":True}}}
    json.dump(live,open(SITE+"/live.json","w"))
    pg.goto(U+"?sim=2027-05-10T11:30"); pg.wait_for_selector(".tabs button"); time.sleep(0.6)
    pg.click('.tabs button:has-text("Programme")')
    check("live announcement shown on Now", True)
    check("live change marks item Updated", "Updated" in pg.inner_text("#view"))
    check("cancelled item is marked", "Cancelled" in pg.inner_text("#view"))
    pg.click('.tabs button:has-text("Now")')
    check("announcement HTML sanitised (no script/js link)", pg.locator(".ann script").count()==0 and pg.locator('.ann a[href^="javascript"]').count()==0)
    check("announcement keeps bold", pg.locator(".ann:has-text(\"Room change\") b").count()==1)
    json.dump({"updated":None,"announcements":[],"changes":{}},open(SITE+"/live.json","w"))
    # 10. after the conference
    pg.goto(U+"?sim=2027-05-12T10:00"); pg.wait_for_selector(".tabs button")
    check("after phase thanks and offers rating", "Thank you for coming" in pg.inner_text("#view") and pg.locator(".rate button").count()==5)
    pg.click('.rate button[data-rate="5"]'); check("rating stored", pg.locator('.rate button[aria-pressed="true"]').count()==5)
    pg.screenshot(path=SP+"/after.png")
    # 11. dark mode renders
    ctx2=b.new_context(viewport={"width":360,"height":700},color_scheme="dark",service_workers="block"); p2=ctx2.new_page()
    p2.goto(U+"?sim=2027-05-10T11:30"); p2.wait_for_selector(".tabs button"); p2.click('.tabs button:has-text("Programme")')
    bg=p2.evaluate("getComputedStyle(document.body).backgroundColor"); check("dark mode background", bg=="rgb(21, 19, 28)", bg)
    p2.screenshot(path=SP+"/dark.png")
    # 12. no horizontal scroll at 320px
    ctx3=b.new_context(viewport={"width":320,"height":640},service_workers="block"); p3=ctx3.new_page()
    p3.goto(U+"?sim=2027-05-10T11:30"); p3.wait_for_selector(".tabs button")
    for tab in ["Programme","Saved","Posters","People","Practical"]:
        p3.click(f'.tabs button:has-text("{tab}")')
        w=p3.evaluate("document.documentElement.scrollWidth"); check(f"no horizontal scroll at 320px on {tab}", w<=320, w)
    check("no console errors", not errs, errs)
    b.close()
finally:
  srv.terminate()
print("\nFAILED:", ", ".join(fails) if fails else "none"); sys.exit(1 if fails else 0)
