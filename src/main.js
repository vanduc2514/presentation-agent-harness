import "./styles.css";
import "impress.js/js/impress.js";

const slides = [
  {
    id: "agenda",
    classes: "step step-card theme-map",
    position: { x: -5500, y: -1800, rotate: -8, scale: 1.0 },
    eyebrow: "Narrative Path",
    title: "Evaluating IDEs for the AI Agent Era",
    lead: "A concise route through fundamentals, harness design, and evaluation.",
    takeaway: "Start with the floor. Then test the harness.",
    numberedPoints: [
      "What still defines an elite IDE",
      "How AI extends the IDE into a harness engine",
      "The four evaluation groups",
      "How to self-benchmark under pressure",
      "What matters at the end of the day"
    ]
  },
  {
    id: "ide-basics",
    classes: "step step-card theme-core",
    position: { x: -8000, y: -1200, rotate: -14, scale: 1.0 },
    eyebrow: "The Floor",
    title: "An Elite IDE Still Wins on Fundamentals",
    lead:
      "Any AI-native IDE that misses the basics is already disqualified.",
    takeaway: "AI capability cannot compensate for weak core ergonomics.",
    gridItems: [
      ["Speed", "Response time must not break cognitive flow."],
      ["Navigation", "Search, symbol jump, and file movement must stay effortless."],
      ["Execution", "Tasks, launch configs, and direct runs must be first-class."],
      ["Debugger", "Breakpoints, watches, and step-through fidelity must be reliable."]
    ]
  },
  {
    id: "harness-architecture",
    classes: "step step-card theme-architecture",
    position: { x: -5500, y: -4500, rotate: 3, scale: 1.0 },
    eyebrow: "Architecture Shift",
    title: "The IDE Becomes a Harness Engine",
    lead:
      "The model reasons, but the harness controls context, tools, state, and memory.",
    takeaway: "Model quality is necessary. Harness quality is differentiating.",
    stackItems: [
      ["IDE / Harness Engine", "Shapes prompts, manages tools, memory, session state, and safety boundaries."],
      ["Agent", "Runs the decision loop: read, ask, edit, execute, verify."],
      ["LLM", "Provides reasoning and generation over the supplied context."]
    ]
  },
  {
    id: "overview",
    classes: "step step-card theme-overview overview-step",
    position: { x: 4000, y: 0, scale: 11 },
    eyebrow: "Evaluation Lens",
    title: "Four Groups Reveal Harness Quality",
    lead:
      "Rather than chase isolated features, evaluate the system through four coherent dimensions.",
    takeaway: "Each group answers a distinct question about trust and effectiveness.",
    navCards: [
      ["A", "Context & Memory", "What does it know?", "context-memory"],
      ["B", "Control & Customization", "Who is in charge?", "control-customization"],
      ["C", "Safety & Observability", "Can you trust it?", "safety-observability"],
      ["D", "Extended Capabilities", "What else can it do?", "extended-capabilities"]
    ]
  },
  {
    id: "context-memory",
    classes: "step step-card theme-a",
    position: { x: 12500, y: -2500, rotate: 12, scale: 1.0 },
    eyebrow: "Group A",
    title: "Context & Memory",
    lead:
      "If context quality collapses, the agent hallucinates, repeats mistakes, and loses continuity.",
    takeaway: "Context fidelity compounds. Weak retention creates constant re-explanation overhead.",
    gridItems: [
      ["Live Repo Context", "Reads Git state, structure, README, and uncommitted changes."],
      ["Prompt Caching", "Reuses stable prompt layers instead of rebuilding every turn."],
      ["Context Compaction", "Compresses without dropping key decisions when windows fill up."],
      ["Session Resumption", "Recovers working memory across pauses, crashes, and next-day restarts."]
    ],
    note: "A strong harness understands the current repository state, not just the open file."
  },
  {
    id: "control-customization",
    classes: "step step-card theme-b",
    position: { x: 14500, y: 0, rotate: -4, scale: 1.0 },
    eyebrow: "Group B",
    title: "Control & Customization",
    lead:
      "Autonomy without runtime control is risk. Customization turns the agent from generic to team-native.",
    takeaway: "Developers need sovereignty over the loop, not just a better autocomplete.",
    dualColumns: {
      leftTitle: "Runtime Sovereignty",
      leftItems: [
        "Pause and steer mid-task without losing state.",
        "Branch or restore sessions at meaningful checkpoints.",
        "Dispatch work through a predictable task queue.",
        "Spawn sub-agents with visibility and merge control."
      ],
      rightTitle: "Teaching the Agent",
      rightItems: [
        "Encode constraints and conventions at project or org scope.",
        "Drive consistency across sessions with repeatable protocols.",
        "Hook agents into saves, test failures, CI, or PR events.",
        "Swap models by task, budget, or local endpoint."
      ]
    }
  },
  {
    id: "safety-observability",
    classes: "step step-card theme-c",
    position: { x: 12500, y: 2500, rotate: -12, scale: 1.0 },
    eyebrow: "Group C",
    title: "Safety & Observability",
    lead:
      "Agents write files, run commands, call APIs, and inspect secrets. Trust requires both enforcement and traces.",
    takeaway: "A harness is only safe when risky actions are constrained and fully inspectable.",
    gridItems: [
      ["Tool Controls", "Per-tool permissions and approval gates for destructive or networked actions."],
      ["Prompt Injection Protection", "Sanitizes hostile content from comments, tools, and external responses."],
      ["Isolation", "Runs in sandboxes, containers, or remote environments when needed."],
      ["Debug Logs", "Captures tool calls, prompts, responses, and chronology for audits."],
      ["Trace Navigation", "Lets you inspect hidden context and the exact point reasoning diverged."],
      ["Behavioral Correction", "Turns findings into persistent rules without resetting all progress."]
    ]
  },
  {
    id: "extended-capabilities",
    classes: "step step-card theme-d",
    position: { x: 14500, y: -3200, rotate: 8, scale: 1.0 },
    eyebrow: "Group D",
    title: "Extended Capabilities",
    lead:
      "The strongest harnesses extend beyond the editor into workflow orchestration.",
    takeaway: "Reach matters when the engineering loop spans specs, CI, browsers, and long-running jobs.",
    gridItems: [
      ["Spec-Driven Development", "Translate intent into requirements, design, tasks, and implementation."],
      ["Agent-First Manager UI", "Track multiple parallel workflows from a mission-control view."],
      ["CLI + Cloud Agents", "Invoke from scripts and run work that outlives the local session."],
      ["Browser / CI / Test Automation", "Close loops outside the file editor and pull results back in."]
    ]
  },
  {
    id: "self-benchmark",
    classes: "step step-card theme-benchmark",
    position: { x: 1200, y: 5800, rotate: -8, scale: 1.0 },
    eyebrow: "Benchmark Method",
    title: "Run a Real Self-Benchmark",
    lead:
      "There is no substitute for two honest hours in your own codebase with your own constraints.",
    takeaway: "The tool is not the problem. Getting work done is the problem.",
    timelineItems: [
      ["01", "Pick a representative multi-file task."],
      ["02", "Use the same prompt and a fixed time box in every IDE."],
      ["03", "Track context fidelity, correction rate, and control."],
      ["04", "Score harness quality, not code generation theatrics."]
    ],
    note: "Watch whether the agent asks clarifying questions, remembers earlier choices, and leaves you feeling in control."
  },
  {
    id: "closing",
    classes: "step step-card theme-closing",
    position: { x: 6000, y: 5800, rotate: 5, scale: 1.8 },
    eyebrow: "End State",
    title: "Intent to Outcome Is the Metric",
    lead:
      "Every major IDE can access strong models. Durable advantage now comes from harness quality.",
    takeaway: "Choose the IDE that gets out of your way fastest while keeping you firmly in control.",
    points: [
      "Know your context needs.",
      "Stay the pilot of the agent loop.",
      "Never compromise on safety primitives.",
      "Keep evaluating through real work, not demos."
    ]
  }
];

const impressRoot = document.querySelector("#impress");

impressRoot.innerHTML = slides.map(renderSlide).join("");

const api = window.impress();
api.init();

document.addEventListener("click", (event) => {
  const target = event.target.closest("[data-goto]");

  if (!target) {
    return;
  }

  event.preventDefault();
  api.goto(target.dataset.goto);
});

function renderSlide(slide) {
  const attributes = renderPositionAttributes(slide.position);

  return `
    <section id="${slide.id}" class="${slide.classes}" ${attributes}>
      <div class="step-shell">
        ${slide.eyebrow ? `<p class="eyebrow">${slide.eyebrow}</p>` : ""}
        <h1 class="slide-title">${slide.title}</h1>
        ${slide.lead ? `<p class="lead">${slide.lead}</p>` : ""}
        ${slide.summary ? `<p class="summary">${slide.summary}</p>` : ""}
        ${slide.takeaway ? `<div class="takeaway">${slide.takeaway}</div>` : ""}
        ${slide.numberedPoints ? renderNumberedPoints(slide.numberedPoints) : ""}
        ${slide.points ? renderPoints(slide.points) : ""}
        ${slide.gridItems ? renderGridItems(slide.gridItems) : ""}
        ${slide.stackItems ? renderStackItems(slide.stackItems) : ""}
        ${slide.navCards ? renderNavCards(slide.navCards) : ""}
        ${slide.dualColumns ? renderDualColumns(slide.dualColumns) : ""}
        ${slide.timelineItems ? renderTimeline(slide.timelineItems) : ""}
        ${slide.note ? `<p class="note">${slide.note}</p>` : ""}
      </div>
    </section>
  `;
}

function renderPositionAttributes(position) {
  return Object.entries(position)
    .map(([key, value]) => `data-${camelToKebab(key)}="${value}"`)
    .join(" ");
}

function renderPoints(points) {
  return `
    <ul class="bullet-list">
      ${points
        .map((point) => `<li class="bullet-item">${point}</li>`)
        .join("")}
    </ul>
  `;
}

function renderNumberedPoints(points) {
  return `
    <ol class="numbered-list">
      ${points
        .map((point) => `<li class="numbered-item">${point}</li>`)
        .join("")}
    </ol>
  `;
}

function renderGridItems(items) {
  return `
    <div class="grid-panel">
      ${items
        .map(
          ([label, text]) => `
            <article class="info-card">
              <h3>${label}</h3>
              <p>${text}</p>
            </article>
          `
        )
        .join("")}
    </div>
  `;
}

function renderStackItems(items) {
  return `
    <div class="stack-panel">
      ${items
        .map(
          ([label, text]) => `
            <article class="stack-card">
              <span class="stack-label">${label}</span>
              <p>${text}</p>
            </article>
          `
        )
        .join("")}
    </div>
  `;
}

function renderNavCards(cards) {
  return `
    <div class="nav-grid">
      ${cards
        .map(
          ([code, label, text, target]) => `
            <button class="nav-card" type="button" data-goto="${target}">
              <span class="nav-code">${code}</span>
              <strong>${label}</strong>
              <span>${text}</span>
            </button>
          `
        )
        .join("")}
    </div>
  `;
}

function renderDualColumns(columns) {
  return `
    <div class="dual-columns">
      <section class="column-card">
        <h3>${columns.leftTitle}</h3>
        <ul>
          ${columns.leftItems.map((item) => `<li>${item}</li>`).join("")}
        </ul>
      </section>
      <section class="column-card">
        <h3>${columns.rightTitle}</h3>
        <ul>
          ${columns.rightItems.map((item) => `<li>${item}</li>`).join("")}
        </ul>
      </section>
    </div>
  `;
}

function renderTimeline(items) {
  return `
    <div class="timeline">
      ${items
        .map(
          ([index, text]) => `
            <article class="timeline-step">
              <span class="timeline-index">${index}</span>
              <p>${text}</p>
            </article>
          `
        )
        .join("")}
    </div>
  `;
}

function camelToKebab(value) {
  return value.replace(/[A-Z]/g, (character) => `-${character.toLowerCase()}`);
}