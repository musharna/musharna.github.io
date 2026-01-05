(function () {
  async function main() {
    const el = document.getElementById("orchidgan-morphospace");
    if (!el) return;

    // Wait until Plotly is actually available
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
    const res = await fetch(url);

    if (!res.ok) {
      el.innerHTML = `<p style="color:#b00;">Could not load PCA data: ${res.status} ${res.statusText}<br>${url}</p>`;
      return;
    }

    const raw = await res.json();

    // ✅ Support either:
    // 1) Array of points: [{x,y,seed}, ...]
    // 2) Object wrapper: { points: [...] }
    const points = Array.isArray(raw) ? raw : raw.points;

    if (!Array.isArray(points)) {
      el.innerHTML = `<p style="color:#b00;">PCA JSON has unexpected format.<br>${url}</p>`;
      console.error("Unexpected PCA JSON:", raw);
      return;
    }

    const xs = points.map(p => p.x);
    const ys = points.map(p => p.y);
    const seeds = points.map(p => p.seed);
    const labels = seeds.map(s => `seed ${s}`);

    const trace = {
      x: xs,
      y: ys,
      mode: "markers",
      type: "scattergl",
      text: labels,
      hovertemplate: "%{text}<extra></extra>",
      marker: { size: 6, opacity: 0.75 }
    };

    const layout = {
      margin: { l: 40, r: 12, t: 8, b: 40 },
      xaxis: { title: "PC1", zeroline: false },
      yaxis: { title: "PC2", zeroline: false },
      dragmode: "pan"
    };

    Plotly.newPlot(el, [trace], layout, { responsive: true, displayModeBar: false });

    // Optional: click loads the corresponding image if you have an image element
    const imgEl = document.getElementById("orchidgan-morph-img");
    const capEl = document.getElementById("orchidgan-morph-cap");
    const base = el.dataset.sampleBase || "/assets/img/orchidgan/samples/webp";

    el.on("plotly_click", (ev) => {
      const i = ev.points?.[0]?.pointIndex;
      if (i == null) return;
      const seed = seeds[i];
      if (imgEl) imgEl.src = `${base}/seed_${String(seed).padStart(4, "0")}.webp`;
      if (capEl) capEl.textContent = `seed ${seed}`;
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", main);
  } else {
    main();
  }
})();
