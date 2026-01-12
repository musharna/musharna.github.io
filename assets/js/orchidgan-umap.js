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

        const xs = pts.map(d => d.x);
    const ys = pts.map(d => d.y);
    const seeds = pts.map(d => d.seed);

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
        opacity: 0.7,
        color: seeds,
        colorscale: 'Viridis',
        showscale: false
      }
    };

    const layout = {
      margin: { l: 45, r: 10, t: 10, b: 45 },
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
