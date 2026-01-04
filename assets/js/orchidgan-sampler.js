(function () {
  const MIN_SEED = 0;
  const MAX_SEED = 99; // change later if you add more seeds
  const BASE = "/assets/img/orchidgan/samples/";

  const seedInput = document.getElementById("orchidgan-seed");
  const img = document.getElementById("orchidgan-img");
  const caption = document.getElementById("orchidgan-caption");
  const status = document.getElementById("orchidgan-status");
  const loadBtn = document.getElementById("orchidgan-load");
  const randomBtn = document.getElementById("orchidgan-random");

  if (!seedInput || !img || !caption || !status || !loadBtn || !randomBtn) {
    // If you see this in console, the HTML block didn't render.
    console.warn("OrchidGAN sampler elements not found on page.");
    return;
  }

  function clamp(n) { return Math.max(MIN_SEED, Math.min(MAX_SEED, n)); }
  function pad4(n) { return String(n).padStart(4, "0"); }
  function setStatus(t) { status.textContent = t || ""; }

  function loadSeed(n) {
    const seed = clamp(parseInt(n, 10) || 0);
    seedInput.value = seed;

    const filename = `seed_${pad4(seed)}.webp`;
    const url = BASE + filename;

    setStatus("Loading…");
    img.onload = () => setStatus("");
    img.onerror = () => setStatus(`Missing: ${filename}`);

    img.src = url + `?v=${Date.now()}`;
    caption.textContent = filename;
  }

  loadBtn.addEventListener("click", () => loadSeed(seedInput.value));
  randomBtn.addEventListener("click", () => {
    const seed = Math.floor(Math.random() * (MAX_SEED - MIN_SEED + 1)) + MIN_SEED;
    loadSeed(seed);
  });
  seedInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") loadSeed(seedInput.value);
  });
})();
