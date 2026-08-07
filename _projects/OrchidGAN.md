---
layout: page
title: Orchid GAN
description: "StyleGAN2-ADA fine-tuned on Cattleya, giving a navigable latent morphospace for orchid floral form. The starting point of the orchid programme."
img: assets/img/orchidgan/stylemix/28-28.png
importance: 3
# Deep dive — see OrchidCLIP.md. Not in display_categories.
category: orchid deep dive
related_publications: false
---

OrchidGAN is a StyleGAN2-ADA model fine-tuned on a curated set of _Cattleya_ images, from weights pretrained on a public flowers dataset. It was the first piece of the [orchid programme]({{ '/projects/OrchidVision/' | relative_url }}), and it answered one question: whether orchid floral morphology is learnable from photographs at all.

It is. What the model returns is a latent space you can move around in, which the panels below do four ways — sampling seeds, interpolating between them, mixing style across resolutions, and laying the space out as a UMAP.

The model has no notion of _which_ orchid it has drawn, which is what led to [orchid-clip-v8]({{ '/projects/OrchidCLIP/' | relative_url }}).

{% include orchidgan-sampler.html %}

{% include orchidgan_morphospace.html %}

{% include orchidgan_umap.html %}

{% include orchidgan_latent_arithmetic.html %}

**Attribution**: This project builds on the StyleGAN2-ADA framework developed by NVIDIA. Initial model weights were pretrained on a publicly available flowers dataset and subsequently fine-tuned on a curated collection of Cattleya orchid images. Training images are not redistributed.
