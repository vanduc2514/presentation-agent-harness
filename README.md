# Evaluating IDEs for the AI Agent Era

A non-linear presentation on how to assess modern IDEs as agent harnesses rather than just code editors. The slides walk through the fundamentals that still define a capable IDE, how the architecture shifts when an AI agent is in the loop, and a structured framework for evaluating harness quality across four dimensions.

Live at [slides.nvduc.dev](https://slides.nvduc.dev).

## Background

As AI-native IDEs have multiplied, the common approach to evaluation — comparing model quality or autocomplete speed — misses the more meaningful question: how well does the IDE manage context, tools, state, and control on behalf of the developer?

Sebastian Raschka's [Components of a Coding Agent](https://magazine.sebastianraschka.com/p/components-of-a-coding-agent) makes this distinction concrete. A coding agent is not just an LLM — it is the combination of a planning loop, tool execution, memory, and the orchestration layer that ties them together. The IDE is that orchestration layer. How it shapes prompts, manages context windows, persists state, and enforces safety boundaries determines whether the agent is productive or brittle.

This presentation takes that framing and applies it to evaluation: instead of scoring individual features, it groups IDE capabilities into four coherent dimensions that together reflect harness quality.

## Evaluation Framework

| Group | Dimension | Core question |
| --- | --- | --- |
| A | Session & Context | What does it know, and for how long? |
| B | Control & Customization | Who is in charge of the agent loop? |
| C | Safety & Observability | Can you trust it and trace what it did? |
| D | Extended Capabilities | How far does the harness reach? |

Each group surfaces a different failure mode: context collapse, loss of developer control, unsafe or opaque execution, and inability to integrate into broader workflows.

## Build

The presentation is built with [impress.js](https://impress.js.org) and bundled with [Vite](https://vitejs.dev). Slide content lives in `slides/deck.md` as YAML-frontmatter Markdown, parsed and rendered by a custom pipeline in `src/`.

```sh
npm install
npm run build       # Vite build → dist/
```

A secondary build using [markpress](https://github.com/kroitor/markpress) produces a self-contained HTML file from `slides/presentation.md`:

```sh
npm run build:markpress   # → output/index.html
```

## Run (Docker)

```sh
docker run -p 8080:80 git.nvduc.lab/nvduc/presentation-agent-harness:latest
```

Open [http://localhost:8080](http://localhost:8080).

## Dev

```sh
npm install
npm run dev
```
