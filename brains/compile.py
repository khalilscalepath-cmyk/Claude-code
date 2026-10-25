#!/usr/bin/env python3
"""Thin shim: the compiler now lives in brains/compile.js.

There used to be two implementations of this - one here and one in app/lib/brain.js for the
running app - and two implementations of the same prompt is how a client ends up with an agent
that quotes a price the sales demo never showed. This forwards to the single one.

    python3 brains/compile.py --client ac-handyman --all --out out/ach/
    node     brains/compile.js --client ac-handyman --all --out out/ach/   # the same thing
"""
import os, subprocess, sys

js = os.path.join(os.path.dirname(os.path.abspath(__file__)), "compile.js")
try:
    sys.exit(subprocess.call(["node", js] + sys.argv[1:]))
except FileNotFoundError:
    sys.exit("node is required to compile prompts: https://nodejs.org")
