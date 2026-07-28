#!/usr/bin/env python3
"""Card image for the MCP Servers page.

No text: the card renders its own title and description directly beneath the
image, so anything written here is duplication. An earlier version listed the
five server names and read as a decorated list rather than a mark.

The figure is one hub with five spokes - one protocol, five servers - which is
the whole idea, and it stays legible at the ~350px the card actually renders at
in the 3-column grid.

Palette from the site's own _sass/_variables.scss, so it belongs to the site in
either theme: purple #b509ac is $purple-color (light-theme
--global-theme-color), cyan #2698ba is $cyan-color (dark-theme).
"""
import signal, sys, math
signal.signal(signal.SIGALRM, lambda *_: (sys.stderr.write("aborting: walltime guard\n"), sys.exit(2)))
signal.alarm(90)

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import Circle, FancyBboxPatch

W, H, DPI = 1040, 620, 100
BG, PANEL = "#0f1117", "#151925"
PURPLE, CYAN = "#b509ac", "#2698ba"

fig = plt.figure(figsize=(W/DPI, H/DPI), dpi=DPI, facecolor=BG)
ax = fig.add_axes((0.0, 0.0, 1.0, 1.0)); ax.set_xlim(0, W); ax.set_ylim(0, H); ax.axis("off")
ax.add_patch(FancyBboxPatch((24, 24), W-48, H-48,
    boxstyle="round,pad=0,rounding_size=24", facecolor=PANEL,
    edgecolor="#232a3a", linewidth=2.5, zorder=0))

cx, cy, R = W/2, H/2, 205
for i in range(5):
    a = math.radians(-90 + i*72)
    x, y = cx + R*math.cos(a), cy + R*math.sin(a)
    ax.plot([cx, x], [cy, y], color=CYAN, lw=5.0, alpha=0.55, zorder=1)
    ax.add_patch(Circle((x, y), 40, facecolor=BG, edgecolor=CYAN, lw=8, zorder=3))
ax.add_patch(Circle((cx, cy), 72, facecolor=PURPLE, edgecolor="none", zorder=4))

out = sys.argv[1] if len(sys.argv) > 1 else "card.png"
fig.savefig(out, facecolor=BG, dpi=DPI)
print("wrote", out)
