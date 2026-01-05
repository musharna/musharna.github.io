(() => {
  const DATA_URL = "/assets/data/orchidgan/morphospace_pca_z.json";
  const SAMPLE_BASE = "/assets/img/orchidgan/samples/webp"; // must match your files

  const plotEl = document.getElementById("orchidgan-plot");
  const imgEl = document.getElementById("orchidgan-morph-img");
  const capEl = document.getElementById("orchidgan-morph-cap");

  if (!plotEl || !imgEl || !capEl) return;

  const seedToPath = (seed) => `${SAMPLE_BASE}/seed_${String(seed).padStart(4, "0")}.webp`;

  fetch(DATA_URL)
    .then(r => r.json())
    .then(data => {
      const pts = data.points || [];
      const xs = pts.map(p => p.x);
      const ys = pts.map(p => p.y);
      const seeds = pts.map(p => p.seed);

      const trace = {
        x: xs,
        y: ys,
        mode: "markers",
        type: "scattergl",
        text: seeds.map(s => `seed ${s}`),
        hovertemplate: "%{text}<extra></extra>",
        marker: { size: 7, opacity: 0.75 }
      };

      const layout = {
        margin: { l: 30, r: 10, t: 10, b: 30 },
        xaxis: { title: "PC1", zeroline: false },
        yaxis: { title: "PC2", zeroline: false },
        dragmode: "pan"
      };

      Plotly.newPlot(plotEl, [trace], layout, { responsive: true, displayModeBar: false });

      plotEl.on("plotly_click", (ev) => {
        const i = ev.points?.[0]?.pointIndex;
        if (i == null) return;
        const seed = seeds[i];
        imgEl.src = seedToPath(seed);
        capEl.textContent = `seed ${seed}`;

        // Optional: if you want to sync your sampler input too, uncomment and adapt ids:
        // const samplerInput = document.getElementById("orchidgan-seed");
        // if (samplerInput) samplerInput.value = seed;
      });
    })
    .catch(err => {
      console.error("Morphospace load failed:", err);
      plotEl.innerHTML = `<p style="opacity:.7;">Failed to load morphospace data.</p>`;
    });
})();
