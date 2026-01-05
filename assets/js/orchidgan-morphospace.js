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

    const data = await res.json();
    // Expecting something like: [{x:..., y:..., seed:..., img:"seed_0018.webp"}, ...]

    const xs = data.map(d => d.x);
    const ys = data.map(d => d.y);
    const labels = data.map(d => `seed ${d.seed}`);

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
      margin: { l: 30, r: 10, t: 10, b: 30 },
      xaxis: { title: "PC1" },
      yaxis: { title: "PC2" },
      dragmode: "pan"
    };

    Plotly.newPlot(el, [trace], layout, { responsive: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", main);
  } else {
    main();
  }
})();
