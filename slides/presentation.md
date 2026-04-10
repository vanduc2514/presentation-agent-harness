<!--slide-attr x=-5500,y=-1800,rotate=-8,scale=1.0,id=agenda,theme=map,layout=agenda -->

<p class="eyebrow">Opening</p>

# Evaluating IDEs for the AI Agent Era

A concise route through fundamentals, harness design, and evaluation.

1. What still defines an elite IDE
2. How AI extends the IDE into a harness engine
3. The four evaluation groups
4. How to self-benchmark under pressure
5. What matters at the end of the day

------

<!--slide-attr x=-8000,y=-1200,rotate=-14,scale=1.0,id=ide-basics,theme=core,layout=grid -->

<p class="eyebrow">The Classic IDE</p>

# An Elite IDE Still Wins on Fundamentals

Any AI-native IDE that misses the basics is already disqualified.

| Capability | Why it matters |
| --- | --- |
| Speed | Response time must not break cognitive flow. |
| Navigation | Search, symbol jump, and file movement must stay effortless. |
| Execution | Tasks, launch configs, and direct runs must be first-class. |
| Debugger | Breakpoints, watches, and step-through fidelity must be reliable. |

------

<!--slide-attr x=-5500,y=-4500,rotate=3,scale=1.0,id=harness-architecture,theme=architecture,layout=stack -->

<p class="eyebrow">Architecture Shift</p>

# The IDE Becomes a Harness Engine

The model reasons, but the harness controls context, tools, state, and memory.

<p><img src="images/harness-engineering.png" alt="Harness Engineering" style="object-fit: contain; background: #1c1917;"></p>

| Layer | Role |
| --- | --- |
| IDE / Harness Engine | Shapes prompts, manages tools, memory, session state, and safety boundaries. |
| Agent | Runs the decision loop: read, ask, edit, execute, verify. |
| LLM | Provides reasoning and generation over the supplied context. |

------

<!--slide-attr x=4000,y=0,scale=11,id=overview,theme=overview,layout=nav -->

<p class="eyebrow">Evaluation Lens</p>

# The Quality of Harness

Evaluate the system through coherent dimensions.

![Car Engine](https://images.unsplash.com/photo-1764769488195-2abc51a556ee?q=80&w=800&auto=format&fit=crop)

| Code | Label | Prompt | Target |
| --- | --- | --- | --- |
| A | Session & Context | What does it know? | session-context |
| B | Control & Customization | Who is in charge? | control-customization |
| C | Safety & Observability | Can you trust it? | safety-observability |
| D | Extended Capabilities | What else can it do? | extended-capabilities |

------

<!--slide-attr x=12500,y=-2500,rotate=12,scale=1.0,id=session-context,theme=a,layout=grid -->

<p class="eyebrow">Group A</p>

# Session & Context

If context quality collapses, the agent hallucinates, repeats mistakes, and loses continuity.

![Session and context window diagram](images/chat-session-reference.png)

| Capability | Why it matters |
| --- | --- |
| Live Repo Context | Reads Git state, structure, README, and uncommitted changes. |
| Prompt Caching | Reuses stable prompt layers instead of rebuilding every turn. |
| Context Compaction | Compresses without dropping key decisions when windows fill up. |
| Session Resumption | Recovers working memory across pauses, crashes, and next-day restarts. |

------

<!--slide-attr x=14500,y=0,rotate=-4,scale=1.0,id=control-customization,theme=b,layout=dual -->

<p class="eyebrow">Group B</p>

# Control & Customization

Autonomy without runtime control is risk. Customization turns the agent from generic to team-native.

![Cockpit control panel](https://images.unsplash.com/photo-1768554591368-292194a9f50c?w=1200&q=80&auto=format&fit=crop)

<!-- goto: runtime-sovereignty-example -->

## Runtime Sovereignty

- Pause and steer mid-task.
- Branch / Restore at checkpoints.
- Dispatch work through a task queue.
- Spawn sub-agents.

<!-- goto: teaching-agent-example -->

## Teaching the Agent

- Encode constraints and conventions.
- Drive consistency across sessions.
- Hook agents into session events.
- Swap models by providers.

------

<!--slide-attr x=16800,y=0,rotate=4,scale=1.0,id=runtime-sovereignty-example,theme=b -->

<p class="eyebrow">Group B · Runtime Sovereignty</p>

# Control the Agent

![Assign agent task in parallel](images/vscode-multi-agent.png)

![Restore to a safe checkpoint](https://preview.redd.it/does-windsurf-have-restore-checkpoints-similar-to-cursor-v0-u2j82imlr3ne1.png?width=744&format=png&auto=webp&s=20ba9f40b0e54d9bf5b5f34265aa467c8abb6c38)

![Spawning sub-agents](https://uploads-us-west-2.insided.com/securitygooglecloud-en/attachment/77dd38de-9d6c-47b6-8a13-db3b2cdd7731.png)

------

<!--slide-attr x=19100,y=-1200,rotate=-5,scale=1.0,id=teaching-agent-example,theme=b -->

<p class="eyebrow">Group B · Teaching the Agent</p>

# Teaching the Agent

![Encoding team conventions](images/agents-md.png)

![Configuring custom hooks](https://us1.discourse-cdn.com/cursor1/original/3X/f/3/f38edef721403651268a1559d863f6da85491766.png)

------

<!--slide-attr x=12500,y=2500,rotate=-12,scale=1.0,id=safety-observability,theme=c,layout=grid -->

<p class="eyebrow">Group C</p>

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

------

<!--slide-attr x=10200,y=4500,rotate=8,scale=1.0,id=safety-example,theme=c -->

<p class="eyebrow">Group C · Safety</p>

# Restricting the Agent

![Allow tool configuration](https://code.visualstudio.com/assets/docs/copilot/chat-tools/agent-mode-select-tools.png)

![Approval gate for tool execution](https://antigravity.google/assets/image/docs/always-allow-url.png)

![Prompt injection Warning](https://code.visualstudio.com/assets/updates/1_101/fetch-warning.png)

![Sanboxing environment](https://code.visualstudio.com/assets/docs/copilot/trust-and-safety/sandbox-prompt.png)

------

<!--slide-attr x=10200,y=6800,rotate=-6,scale=1.0,id=observability-example,theme=c -->

<p class="eyebrow">Group C · Observability</p>

# Observing the Agent

![Navigating the agent trace](images/vscode-agent-debug-logs.png)

![In-chat Tool Inspection](https://cursor.com/docs-static/images/context/mcp/tool-call.png)

![Troubleshoot Agent Behavior](images/vscode-agent-troubleshooting.png)

------

<!--slide-attr x=14500,y=-3200,rotate=8,scale=1.0,id=extended-capabilities,theme=d,layout=grid -->

<p class="eyebrow">Group D</p>

# Extended Capabilities

The strongest harnesses extend beyond the editor into workflow orchestration.

| Capability | Why it matters |
| --- | --- |
| Spec-Driven Development | Translate intent into requirements, design, tasks, and implementation. |
| Agent-First Manager UI | Track multiple parallel workflows from a mission-control view. |
| CLI + Cloud Agents | Invoke from scripts and run work that outlives the local session. |
| Browser / CI / Test Automation | Close loops outside the file editor and pull results back in. |

------

<!--slide-attr x=16800,y=-4800,rotate=3,scale=1.0,id=extended-feature-example,theme=d -->

<p class="eyebrow">Group D · Extended Features</p>

# Extending the Agent

![Spec Development Workflow](https://martinfowler.com/articles/exploring-gen-ai/sdd-kiro-tasks-example.png)

![Agent Manager](https://cdn-blog.scalablepath.com/uploads/2025/12/google-antigravity-agent-manager.png)

![Cloud Agent](images/copilot-cloud-agent.png)

![CLI Agent](https://docs.github.com/assets/cb-213582/images/help/copilot/copilot-cli-welcome.png)

------

<!--slide-attr x=1200,y=5800,rotate=-8,scale=1.0,id=self-benchmark,theme=benchmark,layout=timeline -->

<p class="eyebrow">Evaluation Method</p>

# Run a Self-Benchmark

There is no substitute for X honest hours in your own codebase with your own constraints.

> The tool is not the problem. Getting work done is the problem.

| Step | Action |
| --- | --- |
| 01 | Pick a representative multi-file task. |
| 02 | Use the same prompt and a fixed time box in every IDE. |
| 03 | Track context fidelity, correction rate, and control. |
| 04 | Score harness quality, not code generation metrics. |

------

<!--slide-attr x=6000,y=5800,rotate=5,scale=1.8,id=closing,theme=closing -->

<p class="eyebrow">Closing</p>

# Intent to Outcome Is the Metric

Every major IDE can access strong models. Durable advantage now comes from harness quality.

> Choose the IDE that gets out of your way fastest while keeping you firmly in control.

- Know your context needs.
- Stay the pilot of the agent loop.
- Never compromise on safety primitives.
- Keep evaluating through real work, not demos.
