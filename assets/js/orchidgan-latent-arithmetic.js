(function () {
  const seedSelect = document.getElementById('latent-seed-select');
  const colorSlider = document.getElementById('color-slider');
  const sizeSlider = document.getElementById('size-slider');
  const colorValue = document.getElementById('color-value');
  const sizeValue = document.getElementById('size-value');
  const preview = document.getElementById('latent-preview');
  const caption = document.getElementById('latent-caption');
  const resetBtn = document.getElementById('reset-sliders');

  if (!seedSelect || !colorSlider || !sizeSlider || !preview) return;

  function formatStrength(value) {
    const sign = value >= 0 ? 'plus' : 'minus';
    const abs = Math.abs(value).toFixed(1).replace('.', 'p');
    return `${sign}${abs}`;
  }

  function updateImage() {
    const seed = seedSelect.value.padStart(4, '0');
    const colorStrength = parseFloat(colorSlider.value);
    const sizeStrength = parseFloat(sizeSlider.value);

    colorValue.textContent = colorStrength.toFixed(1);
    sizeValue.textContent = sizeStrength.toFixed(1);

    let direction, strength;
    if (Math.abs(colorStrength) >= Math.abs(sizeStrength)) {
      direction = 'color_to_white';
      strength = colorStrength;
    } else {
      direction = 'petal_size';
      strength = sizeStrength;
    }

    const strengthStr = formatStrength(strength);
    const url = `/assets/img/orchidgan/latent_walks/seed_${seed}_${direction}_${strengthStr}.webp`;

    preview.src = url;

    const parts = [`seed ${parseInt(seed)}`];
    if (colorStrength !== 0) {
      parts.push(colorStrength > 0 ? `whiter (+${colorStrength.toFixed(1)})` : `more colorful (${colorStrength.toFixed(1)})`);
    }
    if (sizeStrength !== 0) {
      parts.push(sizeStrength > 0 ? `larger petals (+${sizeStrength.toFixed(1)})` : `smaller petals (${sizeStrength.toFixed(1)})`);
    }
    caption.textContent = parts.join(', ');
  }

  seedSelect.addEventListener('change', updateImage);
  colorSlider.addEventListener('input', updateImage);
  sizeSlider.addEventListener('input', updateImage);

  resetBtn.addEventListener('click', () => {
    colorSlider.value = 0;
    sizeSlider.value = 0;
    updateImage();
  });

  updateImage();
})();
