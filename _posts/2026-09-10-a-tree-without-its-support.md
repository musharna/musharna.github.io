---
layout: post
title: Why infer_tree has no way to skip the bootstrap
date: 2026-09-10
description: A short note on a design decision in phylokit-mcp.
tags: mcp tooling phylogenetics
categories: tooling
---

When I wrote `infer_tree` for [phylokit-mcp](https://github.com/musharna/phylokit-mcp), the
first version had a `bootstrap` flag that defaulted to off. Bootstrapping is slow, and I
figured an agent asking for a quick tree would not want to wait for it.

Then I tried it on a bad alignment. I simulated sequences from a 7-taxon tree I knew, cut
the alignment down to 60 sites, and ran the tool. The tree came back fully resolved and
looked fine. One of its clades is not in the tree the data were simulated from.

The Newick string gives no hint of that. The only thing in the output that flags the
problem is the bootstrap value on that clade, and with the flag off there is no bootstrap
value. An agent reading the result cannot tell a solid tree from a bad one, and the person
reading the agent's summary is one step further removed.

So I removed the flag. `infer_tree` always bootstraps and always returns per-clade support.

The other servers follow the same idea. plantcv-mcp returns the segmentation mask with
every set of trait values, because a bad mask still produces a plausible leaf area.
breedsim-mcp runs replicates and reports the spread; five seeds of the same three-cycle
programme gave genetic gains with a standard deviation of 0.247, so a single run quoted to
three decimals is mostly noise.

Anyone doing these analyses by hand already knows this. The difference with an agent in
the loop is that the person asking may never look at the intermediate output, so the tool
has to attach the evidence itself.
