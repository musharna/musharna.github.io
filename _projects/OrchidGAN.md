---
layout: page
title: Orchid GAN
description:
img: assets/img/orchidgan/stylemix/28-28.png
importance: 3
# Deep dive — see OrchidCLIP.md. Not in display_categories.
category: orchid deep dive
related_publications: false
---

This page is a work in progress!
OrchidGAN is a StyleGAN2-ADA model fine-tuned to generate Cattleya orchid flowers. It produces realistic synthetic blooms and supports interpretable visualizations like seed sampling, latent interpolation, and style mixing to explore a learned floral “morphospace.”

{% include orchidgan-sampler.html %}

{% include orchidgan_morphospace.html %}

{% include orchidgan_umap.html %}

{% include orchidgan_latent_arithmetic.html %}

**Attribution**: This project builds on the StyleGAN2-ADA framework developed by NVIDIA. Initial model weights were pretrained on a publicly available flowers dataset and subsequently fine-tuned on a curated collection of Cattleya orchid images. Training images are not redistributed.
