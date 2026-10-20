"""Shared helpers for the browser tests. Needs: python3, playwright (pip install playwright, then playwright install chromium)."""
import os, shutil, subprocess, sys, tempfile, time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
os.environ.setdefault("PLAYWRIGHT_BROWSERS_PATH", os.environ.get("PLAYWRIGHT_BROWSERS_PATH", ""))
if not os.environ["PLAYWRIGHT_BROWSERS_PATH"]:
    del os.environ["PLAYWRIGHT_BROWSERS_PATH"]

def temp_site():
    """A throwaway copy of the app, so tests can change live.json freely."""
    d = Path(tempfile.mkdtemp(prefix="atlas-test-")) / "site"
    shutil.copytree(ROOT, d, ignore=shutil.ignore_patterns("worker", "docs", "tools", "tests", ".git", "assets"))
    return d

def serve(folder, port):
    p = subprocess.Popen([sys.executable, "-m", "http.server", str(port), "--bind", "127.0.0.1"], cwd=folder,
                         stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    time.sleep(1)
    return p

class Checker:
    def __init__(self): self.fails = []
    def __call__(self, name, cond, extra=""):
        print(("PASS " if cond else "FAIL ") + name + ((" -> " + str(extra)) if (extra and not cond) else ""))
        if not cond: self.fails.append(name)
    def done(self):
        print("\nFAILED: " + (", ".join(self.fails) if self.fails else "none"))
        sys.exit(1 if self.fails else 0)
