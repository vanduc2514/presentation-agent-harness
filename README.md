# Evaluating IDEs for the AI Agent Era

[![vi](https://img.shields.io/badge/lang-vi-yellow.svg)](https://github.com/vanduc2514/presentation-agent-harness/blob/main/README.vi-VN.md)

A non-linear presentation on how to assess modern IDEs as agent harnesses rather than just code editors. The slides walk through the fundamentals that still define a capable IDE, how the architecture shifts when an AI agent is in the loop, and a structured framework for evaluating harness quality across four dimensions.

Live at [slides.nvduc.dev](https://slides.nvduc.dev).

## Background

As AI-native IDEs have multiplied, the common approach to evaluation — comparing model quality or autocomplete speed — misses the more meaningful question: how well does the IDE manage context, tools, state, and control on behalf of the developer?

Sebastian Raschka's [Components of a Coding Agent](https://magazine.sebastianraschka.com/p/components-of-a-coding-agent) makes this distinction concrete. A coding agent is not just an LLM — it is the combination of a planning loop, tool execution, memory, and the orchestration layer that ties them together. The IDE is that orchestration layer. How it shapes prompts, manages context windows, persists state, and enforces safety boundaries determines whether the agent is productive or brittle.

This presentation takes that framing and applies it to evaluation. Rather than comparing individual features, it organizes IDE capabilities around evaluation criteria that can help surface harness quality. The criteria covered are grouped into several dimensions — a starting point for structured assessment, not a fixed standard.

## Evaluation Criteria

| Group | Dimension | Core question |
| --- | --- | --- |
| A | Session & Context | What does it know, and for how long? |
| B | Control & Customization | Who is in charge of the agent loop? |
| C | Safety & Observability | Can you trust it and trace what it did? |
| D | Extended Capabilities | How far does the harness reach? |

Each dimension surfaces a different consideration; the list may expand as the tooling and patterns around coding agents continue to mature.

## Render

The presentation is rendered from `slides/presentation.md` using [markpress](https://github.com/kroitor/markpress).

```sh
npm install
npm run build:markpress   # → output/index.html
```
