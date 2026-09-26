---
layout: page
title: MCP Servers
description: "MCP servers for plant genomics research with LLMs: locus lookup, dataset search, phenotyping, phylogenetics, breeding simulation, and a job broker."
img: assets/img/mcpservers/card.svg
importance: 1
category: research tooling
related_publications: false
---

Model Context Protocol servers I maintain, so an agent in Claude Code or another MCP client can look up a locus, find a dataset, measure a plant image, build a tree or simulate a breeding programme. Each is on PyPI and has a client config example in its README. Where a tool computes a number, it also returns what the number came from, such as the segmentation overlay, the bootstrap support or the spread across replicates.

- **[plant-genomics-mcp](https://github.com/musharna/plant-genomics-mcp)**: 50+ tools across 23 public backends (Ensembl Plants, Phytozome, UniProt, AlphaFold DB, JASPAR, KEGG, STRING-DB and others). There is a [hosted demo](https://huggingface.co/spaces/musharna/plant-genomics-mcp).
- **[data-aggregator-mcp](https://github.com/musharna/data-aggregator-mcp)**: search and fetch datasets from Zenodo, DataCite, GEO/SRA, PubMed and OpenAIRE through one interface.
- **[plantcv-mcp](https://github.com/musharna/plantcv-mcp)**: PlantCV trait measurements, returned with the segmentation overlay they were measured from. Batch mode applies a recipe you have checked that way.
- **[phylokit-mcp](https://github.com/musharna/phylokit-mcp)**: phylogenetic inference with IQ-TREE 3 (through piqtree). Trees always come with bootstrap support.
- **[breedsim-mcp](https://github.com/musharna/breedsim-mcp)**: breeding-scheme simulation with AlphaSimR. Reports mean, sd and CI across replicates rather than a single run. Needs R 4.3 or newer.
- **[jobd](https://github.com/musharna/jobd)**: a job broker for my own machines. It routes long jobs by GPU and tool tags and exposes the queue over MCP.

```bash
pip install plant-genomics-mcp data-aggregator-mcp plantcv-mcp phylokit-mcp breedsim-mcp jobd
```

Archived on Zenodo (concept DOIs):
[plant-genomics-mcp](https://doi.org/10.5281/zenodo.21636352) ·
[data-aggregator-mcp](https://doi.org/10.5281/zenodo.21636332) ·
[plantcv-mcp](https://doi.org/10.5281/zenodo.21713516) ·
[phylokit-mcp](https://doi.org/10.5281/zenodo.21713870) ·
[breedsim-mcp](https://doi.org/10.5281/zenodo.21713210) ·
[jobd](https://doi.org/10.5281/zenodo.21636369)
