---
layout: post
title: A tree without its support is not a result
date: 2026-09-10
description: Why the MCP servers I write refuse to hand an agent a single number.
tags: mcp tooling phylogenetics
categories: tooling
---

The first tool I wrote for [phylokit-mcp](https://github.com/musharna/phylokit-mcp) was
`infer_tree`. It runs IQ-TREE 2 on an alignment and returns the topology. The obvious
design has a `bootstrap: bool` flag, off by default, because bootstrapping is slow and an
agent asking for a quick tree probably does not want to wait.

I took the flag out. Here is why.

I simulated an alignment from a known 7-taxon tree, then cut it down to 60 sites, which
is short enough that the signal is weak but not so short that IQ-TREE complains. The
returned topology was fully resolved and looked entirely reasonable. It also contained a
clade that does not exist in the tree the data came from.

Nothing in the Newick string says so. The only part of the output that flags the problem
is the bootstrap support on that clade, and if the flag is off, that number is not there.
An agent reading the result has no way to tell a well-supported tree from a coin flip,
and neither does the person reading the agent's summary.

So `infer_tree` always runs the bootstrap and always returns per-clade support. There is
no option to skip it. The same rule is in the other servers on the
[MCP Servers]({{ '/projects/MCPServers/' | relative_url }}) page: plantcv-mcp returns the
segmentation mask with every trait, and breedsim-mcp runs replicates and reports the
spread instead of one seed's outcome. Five seeds of the same three-cycle breeding programme
gave genetic gains with a standard deviation of 0.247. A single run quoted to three
decimals is reporting noise at the precision of a measurement.

None of this is new to anyone who does the analysis by hand. What changes with an agent
in the loop is that the person asking the question may never see the intermediate output.
The tool is the last place the supporting evidence can be attached, so that is where it
has to go.
