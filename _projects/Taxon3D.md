---
layout: page
title: Taxon3D
description: "A blind-comparison benchmark for AI-generated 3D models of living organisms, judged against reference photographs."
img: assets/img/taxon3d/card.png
importance: 2
category: research tooling
related_publications: false
---

[Arena](https://taxon3d.org/arena) · [Code](https://github.com/musharna/taxon3d) · [Dataset](https://huggingface.co/datasets/musharna/taxon3d-corpus-v1) · [Zenodo](https://doi.org/10.5281/zenodo.21789280)

Benchmarks for 3D generators mostly use furniture and game props. Organisms are harder: a maize plant or a butterfly has branching structure, thin surfaces and a lot of self-occlusion, and whether a model got it right is a question of anatomy.

[Taxon3D](https://taxon3d.org) is a blind-comparison site for 3D generators on plants, fungi and animals. Each vote shows reference photographs of the organism and two anonymised models, and you pick the one closer to the photos. Rankings are Bradley–Terry scores with confidence intervals.

{% include figure.liquid path="assets/img/taxon3d/card.png" title="The arena" alt="A single-image 3D reconstruction task with reference photographs of the real organism above and two anonymised 3D models side by side for comparison." class="img-fluid rounded z-depth-1" %}

Active development stopped in September 2026. The arena stays up in maintenance mode, and the dataset and Zenodo archive are the lasting outputs.
