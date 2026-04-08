---
id: agenda
classes: step step-card theme-map
position:
  x: -5500
  y: -1800
  rotate: -8
  scale: 1.0
eyebrow: Opening
---
# Evaluating IDEs for the AI Agent Era

A concise route through fundamentals, harness design, and evaluation.

1. What still defines an elite IDE
2. How AI extends the IDE into a harness engine
3. The four evaluation groups
4. How to self-benchmark under pressure
5. What matters at the end of the day

<!-- slide -->
---
id: ide-basics
classes: step step-card theme-core
layout: grid
position:
  x: -8000
  y: -1200
  rotate: -14
  scale: 1.0
eyebrow: The Classic IDE
---
# An Elite IDE Still Wins on Fundamentals

Any AI-native IDE that misses the basics is already disqualified.

| Capability | Why it matters |
| --- | --- |
| Speed | Response time must not break cognitive flow. |
| Navigation | Search, symbol jump, and file movement must stay effortless. |
| Execution | Tasks, launch configs, and direct runs must be first-class. |
| Debugger | Breakpoints, watches, and step-through fidelity must be reliable. |

<!-- slide -->
---
id: harness-architecture
classes: step step-card theme-architecture
layout: stack
position:
  x: -5500
  y: -4500
  rotate: 3
  scale: 1.0
eyebrow: Architecture Shift
---
# The IDE Becomes a Harness Engine

The model reasons, but the harness controls context, tools, state, and memory.

![Car Engine](https://images.unsplash.com/photo-1764769488195-2abc51a556ee?q=80&w=800&auto=format&fit=crop)

| Layer | Role |
| --- | --- |
| IDE / Harness Engine | Shapes prompts, manages tools, memory, session state, and safety boundaries. |
| Agent | Runs the decision loop: read, ask, edit, execute, verify. |
| LLM | Provides reasoning and generation over the supplied context. |

<!-- slide -->
---
id: overview
classes: step step-card theme-overview overview-step
layout: nav
position:
  x: 4000
  y: 0
  scale: 11
eyebrow: Evaluation Lens
---
# The Quality of Harness

Evaluate the system through coherent dimensions.

![Cockpit control panel](https://images.unsplash.com/photo-1768554591368-292194a9f50c?w=1200&q=80&auto=format&fit=crop)

| Code | Label | Prompt | Target |
| --- | --- | --- | --- |
| A | Session & Context | What does it know? | session-context |
| B | Control & Customization | Who is in charge? | control-customization |
| C | Safety & Observability | Can you trust it? | safety-observability |
| D | Extended Capabilities | What else can it do? | extended-capabilities |

<!-- slide -->
---
id: session-context
classes: step step-card theme-a
layout: grid
position:
  x: 12500
  y: -2500
  rotate: 12
  scale: 1.0
eyebrow: Group A
---
# Session & Context

If context quality collapses, the agent hallucinates, repeats mistakes, and loses continuity.

![Session and context window diagram](/diagrams/chat-session-reference.png)

| Capability | Why it matters |
| --- | --- |
| Live Repo Context | Reads Git state, structure, README, and uncommitted changes. |
| Prompt Caching | Reuses stable prompt layers instead of rebuilding every turn. |
| Context Compaction | Compresses without dropping key decisions when windows fill up. |
| Session Resumption | Recovers working memory across pauses, crashes, and next-day restarts. |

<!-- slide -->
---
id: control-customization
classes: step step-card theme-b
layout: dual-columns
position:
  x: 14500
  y: 0
  rotate: -4
  scale: 1.0
eyebrow: Group B
---
# Control & Customization

Autonomy without runtime control is risk. Customization turns the agent from generic to team-native.

## [Runtime Sovereignty](#runtime-sovereignty-example)

- Pause and steer mid-task without losing state.
- Branch or restore sessions at meaningful checkpoints.
- Dispatch work through a predictable task queue.
- Spawn sub-agents with visibility and merge control.

## [Teaching the Agent](#teaching-agent-example)

- Encode constraints and conventions at project or org scope.
- Drive consistency across sessions with repeatable protocols.
- Hook agents into saves, test failures, CI, or PR events.
- Swap models by task, budget, or local endpoint.

<!-- slide -->
---
id: runtime-sovereignty-example
classes: step step-card theme-b
position:
  x: 16800
  y: 0
  rotate: 4
  scale: 1.0
eyebrow: Group B · Runtime Sovereignty
---
# Runtime Sovereignty Example

A hands-on walk-through of pausing, branching, and steering agents mid-task.

<!-- slide -->
---
id: teaching-agent-example
classes: step step-card theme-b
position:
  x: 19100
  y: -1200
  rotate: -5
  scale: 1.0
eyebrow: Group B · Teaching the Agent
---
# Teaching the Agent Example

A hands-on walk-through of encoding constraints, hooks, and model routing.

<!-- slide -->
---
id: safety-observability
classes: step step-card theme-c
layout: grid
position:
  x: 12500
  y: 2500
  rotate: -12
  scale: 1.0
eyebrow: Group C
---
# Safety & Observability

Agents write files, run commands, call APIs, and inspect secrets. Trust requires both enforcement and traces.

| Capability | Why it matters |
| --- | --- |
| Tool Controls | Per-tool permissions and approval gates for destructive or networked actions. |
| Trace Navigation | Lets you inspect hidden context and the exact point reasoning diverged. |
| Isolation | Runs in sandboxes, containers, or remote environments when needed. |
| Debug Logs | Captures tool calls, prompts, responses, and chronology for audits. |
| Prompt Injection Protection | Sanitizes hostile content from comments, tools, and external responses. |
| Behavioral Correction | Turns findings into persistent rules without resetting all progress. |

<!-- slide -->
---
id: safety-example
classes: step step-card theme-c
position:
  x: 10200
  y: 4500
  rotate: 8
  scale: 1.0
eyebrow: Group C · Safety
---
# Safety Example

A hands-on walk-through of per-tool permissions and approval gates.

<!-- slide -->
---
id: observability-example
classes: step step-card theme-c
position:
  x: 10200
  y: 6800
  rotate: -6
  scale: 1.0
eyebrow: Group C · Observability
---
# Observability Example

A hands-on walk-through of troubleshooting AI Agent.

<!-- slide -->
---
id: extended-capabilities
classes: step step-card theme-d
layout: grid
position:
  x: 14500
  y: -3200
  rotate: 8
  scale: 1.0
eyebrow: Group D
---
# Extended Capabilities

The strongest harnesses extend beyond the editor into workflow orchestration.

| Capability | Why it matters |
| --- | --- |
| Spec-Driven Development | Translate intent into requirements, design, tasks, and implementation. |
| Agent-First Manager UI | Track multiple parallel workflows from a mission-control view. |
| CLI + Cloud Agents | Invoke from scripts and run work that outlives the local session. |
| Browser / CI / Test Automation | Close loops outside the file editor and pull results back in. |

<!-- slide -->
---
id: extended-feature-example
classes: step step-card theme-d
position:
  x: 16800
  y: -4800
  rotate: 3
  scale: 1.0
eyebrow: Group D · Extended Features
---
# Extended Feaures Example

A hands-on walk-through of translating intent into requirements and implementation.

<!-- slide -->
---
id: self-benchmark
classes: step step-card theme-benchmark
layout: timeline
position:
  x: 1200
  y: 5800
  rotate: -8
  scale: 1.0
eyebrow: Evaluation Method
---
# Run a Self-Benchmark

There is no substitute for X honest hours in your own codebase with your own constraints.

> The tool is not the problem. Getting work done is the problem.

| Step | Action |
| --- | --- |
| 01 | Pick a representative multi-file task. |
| 02 | Use the same prompt and a fixed time box in every IDE. |
| 03 | Track context fidelity, correction rate, and control. |
| 04 | Score harness quality, not code generation metrics. |

<!-- slide -->
---
id: closing
classes: step step-card theme-closing
position:
  x: 6000
  y: 5800
  rotate: 5
  scale: 1.8
eyebrow: Closing
---
# Intent to Outcome Is the Metric

Every major IDE can access strong models. Durable advantage now comes from harness quality.

> Choose the IDE that gets out of your way fastest while keeping you firmly in control.

- Know your context needs.
- Stay the pilot of the agent loop.
- Never compromise on safety primitives.
- Keep evaluating through real work, not demos.
