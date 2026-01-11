(function () {
  function pad4(n) {
    return String(n).padStart(4, "0");
  }

  async function main() {
    const el = document.getElementById("orchidgan-umap");
    if (!el) return;

    // Wait for Plotly
    function waitForPlotly() {
      return new Promise((resolve) => {
        const t = setInterval(() => {
          if (window.Plotly) {
            clearInterval(t);
            resolve();
          }
        }, 50);
      });
    }
    await waitForPlotly();

    const url = el.dataset.json;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      el.innerHTML = `<p style="color:#b00;">Could not load UMAP data: ${res.status} ${res.statusText}<br>${url}</p>`;
      return;
    }

    const raw = await res.json();
    const pts = Array.isArray(raw) ? raw : (raw.points || []);
    if (!Array.isArray(pts) || pts.length === 0) {
      el.innerHTML = `<p style="color:#b00;">UMAP JSON loaded but had no points.<br>${url}</p>`;
      return;
    }

    // Try to load color data
    let colorData = null;
    try {
      const colorRes = await fetch('/assets/data/orchidgan/colors.json', { cache: "no-store" });
      if (colorRes.ok) {
        colorData = await colorRes.json();
      }
    } catch (e) {
      console.log("Color data not available, using default coloring");
    }

    const xs = pts.map(d => d.x);
    const ys = pts.map(d => d.y);
    const seeds = pts.map(d => d.seed);

    // Build color array based on hue
    let colors = seeds; // Default: color by seed
    let colorscale = 'Viridis';
    let colorbarTitle = 'Seed';
    let showscale = false;

    if (colorData) {
      // Create seed -> hue mapping
      const seedToHue = {};
      colorData.forEach(c => {
        seedToHue[c.seed] = c.hue;
      });

      colors = seeds.map(s => seedToHue[s] || 300);
      colorscale = [
        [0, '#ff00ff'],     // Magenta (300°)
        [0.111, '#ff0066'], // Pink-magenta (320°)
        [0.222, '#ff0000'], // Red (0°)
        [0.333, '#ff9900'], // Orange (40°)
        [0.444, '#ffff00'], // Yellow (60°)
        [0.556, '#66ff00'], // Yellow-green (100°)
        [0.667, '#00ff99'], // Cyan-green (160°)
        [0.778, '#0099ff'], // Cyan-blue (200°)
        [0.889, '#6600ff'], // Blue-violet (260°)
        [1, '#ff00ff']      // Magenta wraps (300°)
      ];
      colorbarTitle = 'Hue (°)';
      showscale = true;
    }

    const trace = {
      x: xs,
      y: ys,
      mode: "markers",
      type: "scattergl",
      customdata: seeds,
      text: seeds.map(s => `seed ${s}`),
      hovertemplate: "%{text}<extra></extra>",
      marker: {
        size: 8,
        opacity: 0.75,
        color: colors,
        colorscale: colorscale,
        showscale: showscale,
        colorbar: showscale ? {
          title: colorbarTitle,
          len: 0.5,
          thickness: 15
        } : undefined
      }
    };

    const layout = {
      margin: { l: 45, r: 60, t: 10, b: 45 },
      xaxis: { title: "UMAP 1", zeroline: false, showgrid: false },
      yaxis: { title: "UMAP 2", zeroline: false, showgrid: false },
      dragmode: "pan"
    };

    await Plotly.newPlot(el, [trace], layout, { 
      responsive: true, 
      displayModeBar: true 
    });

    // Click -> update preview image
    const imgEl = document.getElementById("orchidgan-umap-img");
    const labelEl = document.getElementById("orchidgan-umap-label");

    el.on("plotly_click", (ev) => {
      const seed = ev?.points?.[0]?.customdata;
      if (seed === undefined || seed === null) return;

      const src = `/assets/img/orchidgan/samples/seed_${pad4(seed)}.webp`;
      if (imgEl) imgEl.src = src;
      if (labelEl) labelEl.textContent = `seed ${seed}`;
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", main);
  } else {
    main();
  }
})();
