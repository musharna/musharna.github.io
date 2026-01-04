---
layout: page
title: Orchid GAN
description: 
img: assets/img/12.jpg
importance: 1
category: 
related_publications: false
---

This page is a work in progress!


<div style="max-width: 1100px; margin: 0 auto;">
  <p>
    Trained a StyleGAN2 model on <strong>exclusively Cattleya orchids</strong>.
    Below is a lightweight sampler: it loads <em>pre-generated</em> outputs from this repo (no backend).
  </p>

  <h2>Dataset vs. Generated (mosaics)</h2>
  <div style="display: grid; gap: 12px; grid-template-columns: 1fr; align-items: start;">
    <figure style="margin: 0;">
      <img src="/assets/img/orchidgan/reals.png" alt="Real Cattleya training images mosaic" style="width: 100%; border-radius: 10px;" />
      <figcaption style="opacity: 0.8; font-size: 0.95em;">Real training images (mosaic)</figcaption>
    </figure>

    <figure style="margin: 0;">
      <img src="/assets/img/orchidgan/fakes_001600.png" alt="StyleGAN2 generated Cattleya images mosaic" style="width: 100%; border-radius: 10px;" />
      <figcaption style="opacity: 0.8; font-size: 0.95em;">Generated images at step 1600 (mosaic)</figcaption>
    </figure>
  </div>

  <h2 style="margin-top: 28px;">Interactive sampler</h2>
  <p style="opacity: 0.85;">
    Try a seed (0–299) or hit Generate. This loads files from <code>/assets/img/orchidgan/samples/</code>.
  </p>

  <div style="display: flex; gap: 10px; flex-wrap: wrap; align-items: center; margin: 10px 0 14px;">
    <label>
      Seed:
      <input id="orchidgan-seed" type="number" min="0" max="299" step="1" value="0"
             style="width: 90px; padding: 6px 8px; margin-left: 6px;" />
    </label>

    <button id="orchidgan-load"
            style="padding: 7px 12px; border-radius: 10px; border: 1px solid rgba(127,127,127,0.4);">
      Load seed
    </button>

    <button id="orchidgan-random"
            style="padding: 7px 12px; border-radius: 10px; border: 1px solid rgba(127,127,127,0.4);">
      Generate
    </button>

    <span id="orchidgan-status" style="opacity: 0.8;"></span>
  </div>

  <figure style="margin: 0;">
    <img id="orchidgan-img"
         src="/assets/img/orchidgan/samples/seed_0000.webp"
         alt="OrchidGAN generated sample"
         style="width: min(512px, 100%); border-radius: 12px; border: 1px solid rgba(127,127,127,0.25);" />
    <figcaption id="orchidgan-caption" style="opacity: 0.8; font-size: 0.95em; margin-top: 6px;">
      seed_0000.webp
    </figcaption>
  </figure>
</div>

<script>
(function () {
  // Update these if you change your sample count or naming scheme.
  const MIN_SEED = 0;
  const MAX_SEED = 299; // must match what you actually commit
  const BASE = "/assets/img/orchidgan/samples/";

  const seedInput = document.getElementById("orchidgan-seed");
  const img = document.getElementById("orchidgan-img");
  const caption = document.getElementById("orchidgan-caption");
  const status = document.getElementById("orchidgan-status");

  function clamp(n) {
    return Math.max(MIN_SEED, Math.min(MAX_SEED, n));
  }

  function pad4(n) {
    return String(n).padStart(4, "0");
  }

  function setStatus(text) {
    status.textContent = text || "";
  }

  function loadSeed(n) {
    const seed = clamp(parseInt(n, 10) || 0);
    seedInput.value = seed;

    const filename = `seed_${pad4(seed)}.webp`;
    const url = BASE + filename;

    setStatus("Loading…");

    // Bust cache when users click around quickly
    img.onload = () => setStatus("");
    img.onerror = () => setStatus(`Missing file: ${filename}`);

    img.src = url + `?v=${Date.now()}`;
    caption.textContent = filename;
  }

  document.getElementById("orchidgan-load").addEventListener("click", () => {
    loadSeed(seedInput.value);
  });

  document.getElementById("orchidgan-random").addEventListener("click", () => {
    const seed = Math.floor(Math.random() * (MAX_SEED - MIN_SEED + 1)) + MIN_SEED;
    loadSeed(seed);
  });

  seedInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") loadSeed(seedInput.value);
  });
})();
</script>
