#!/usr/bin/env python3
"""Runs every test and prints one line each.  Usage: python3 tests/run_all.py"""
import subprocess, sys
from pathlib import Path
here = Path(__file__).parent
tests = [("tools (validate, CSV import)", ["node", str(here / "test_tools.mjs")])] + \
        [(f.stem.replace("test_", "").replace("_", " "), [sys.executable, str(f)]) for f in sorted(here.glob("test_*.py"))]
bad = 0
for name, cmd in tests:
    r = subprocess.run(cmd, capture_output=True, text=True, cwd=here)
    out = r.stdout + r.stderr
    failed = r.returncode != 0 or "FAIL " in out
    n = out.count("PASS ")
    print(f"{'FAIL' if failed else 'ok  '}  {name}  ({n} checks)")
    if failed: bad += 1; print(out)
print("\nAll good." if not bad else f"\n{bad} test group(s) failed.")
sys.exit(1 if bad else 0)
