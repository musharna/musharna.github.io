#!/usr/bin/env python3
"""Card image for the MCP Servers page - v3.

Iteration log, because each fix came from looking at the render at its ACTUAL
display size (~350px wide in the 3-column grid), not at the 1200px canvas:

  v1  designed like a slide. Subtitle ran off the canvas, type illegible at
      350px, dead band between copy and the server row.
  v2  vertical list fixed legibility, but the two footer strings OVERLAPPED -
      the second was placed at a hard-coded +250px offset instead of being
      measured, and "compute tier" is wider than that at 34pt.
  v3  footer position is MEASURED from the rendered extent of the first string;
      canvas tightened and type enlarged so the list fills the frame instead of
      leaving half the card empty.

Palette from the site's own _sass/_variables.scss: purple #b509ac is the
light-theme --global-theme-color, cyan #2698ba the dark-theme one.
"""
import signal, sys
signal.signal(signal.SIGALRM, lambda *_: (sys.stderr.write("aborting: walltime guard\n"), sys.exit(2)))
signal.alarm(90)

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import Circle, FancyBboxPatch

W, H, DPI = 1040, 620, 100
BG, PANEL = "#0f1117", "#151925"
PURPLE, CYAN, DIM, FG = "#b509ac", "#2698ba", "#5a6274", "#f2f5fa"

fig = plt.figure(figsize=(W / DPI, H / DPI), dpi=DPI, facecolor=BG)
ax = fig.add_axes((0.0, 0.0, 1.0, 1.0)); ax.set_xlim(0, W); ax.set_ylim(0, H); ax.axis("off")
MONO = {"family": "DejaVu Sans Mono"}; SANS = {"family": "DejaVu Sans"}

ax.add_patch(FancyBboxPatch((24, 24), W - 48, H - 48,
    boxstyle="round,pad=0,rounding_size=24", facecolor=PANEL,
    edgecolor="#232a3a", linewidth=2.5, zorder=0))

rows = [("plant-genomics", PURPLE), ("data-aggregator", PURPLE),
        ("plantcv", CYAN), ("ldraw", CYAN), ("jobd", CYAN)]

top, row_h, bar_x, fs = H - 118, 86, 82, 54
ax.plot([bar_x, bar_x], [top - row_h * (len(rows) - 1) - 8, top + 8],
        color=PURPLE, lw=4.5, alpha=0.85, zorder=1)

for i, (name, accent) in enumerate(rows):
    y = top - i * row_h
    ax.add_patch(Circle((bar_x, y), 14, facecolor=BG, edgecolor=accent, linewidth=4.5, zorder=3))
    ax.text(bar_x + 46, y, name, color=FG, fontsize=fs, va="center", ha="left", **MONO)

# Footer: MEASURE the first string, then place the second after it. v2 hard-coded
# the offset and the two collided.
fig.canvas.draw()
t1 = ax.text(bar_x, 86, "compute tier", color=PURPLE, fontsize=32,
             fontweight="bold", va="center", ha="left", **SANS)
ext = t1.get_window_extent(renderer=fig.canvas.get_renderer())
x2 = ax.transData.inverted().transform((ext.x1, 0))[0] + 26
ax.text(x2, 86, "not just retrieval", color=DIM, fontsize=32, va="center", ha="left", **SANS)

out = sys.argv[1] if len(sys.argv) > 1 else "card.png"
fig.savefig(out, facecolor=BG, dpi=DPI)
print("wrote", out)
