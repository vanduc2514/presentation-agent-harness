import { unified } from "unified";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import { parse as parseYaml } from "yaml";

const markdownParser = unified().use(remarkParse).use(remarkGfm);
const SLIDE_SEPARATOR = /\n<!--\s*slide\s*-->\s*\n/g;

export function parseSlides(source) {
  return source
    .split(SLIDE_SEPARATOR)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk, index) => parseSlide(chunk, index));
}

function parseSlide(chunk, index) {
  const { content, data } = parseFrontmatter(chunk);
  const slide = {
    id: requireString(data.id, `Slide ${index + 1} is missing frontmatter id.`),
    classes: typeof data.classes === "string" ? data.classes : "step step-card",
    position: normalizePosition(data.position, index)
  };

  if (typeof data.eyebrow === "string") {
    slide.eyebrow = data.eyebrow;
  }

  applyMarkdownContent(slide, markdownParser.parse(content).children, data.layout);

  if (!slide.title) {
    throw new Error(`Slide ${slide.id} is missing an H1 title.`);
  }

  return slide;
}

function parseFrontmatter(chunk) {
  const match = chunk.match(/^---\s*\n([\s\S]*?)\n---\s*\n?/);

  if (!match) {
    return { data: {}, content: chunk.trim() };
  }

  return {
    data: parseYaml(match[1]) ?? {},
    content: chunk.slice(match[0].length).trim()
  };
}

function normalizePosition(position, index) {
  if (!position || typeof position !== "object") {
    throw new Error(`Slide ${index + 1} is missing frontmatter position.`);
  }

  const normalized = {};

  for (const [key, value] of Object.entries(position)) {
    normalized[key] = typeof value === "number" ? value : Number(value);

    if (Number.isNaN(normalized[key])) {
      throw new Error(`Slide ${index + 1} has a non-numeric position.${key} value.`);
    }
  }

  return normalized;
}

function applyMarkdownContent(slide, nodes, layout) {
  slide.content = [];
  let paragraphCount = 0;
  let index = 0;

  while (index < nodes.length) {
    const node = nodes[index];

    if (node.type === "heading" && node.depth === 1) {
      slide.title = extractText(node);
      index += 1;
      continue;
    }

    if (layout === "dual-columns" && node.type === "heading" && node.depth === 2) {
      const { data, consumed } = parseDualColumns(nodes.slice(index));
      slide.content.push({ type: "dualColumns", data });
      index += consumed;
      continue;
    }

    if (node.type === "paragraph") {
      if (node.children.length === 1 && node.children[0].type === "image") {
        const img = node.children[0];
        slide.content.push({ type: "image", src: img.url, alt: img.alt || "" });
        index += 1;
        continue;
      }

      const text = extractText(node).trim();

      if (text) {
        if (/^Note:/i.test(text)) {
          slide.content.push({ type: "note", data: text.replace(/^Note:\s*/i, "") });
        } else {
          const paragraphType = paragraphCount === 0 ? "lead" : paragraphCount === 1 ? "summary" : "note";
          slide.content.push({ type: paragraphType, data: text });
          paragraphCount += 1;
        }
      }

      index += 1;
      continue;
    }

    if (node.type === "blockquote") {
      slide.content.push({ type: "takeaway", data: extractText(node) });
      index += 1;
      continue;
    }

    if (node.type === "list") {
      slide.content.push({ type: node.ordered ? "numberedPoints" : "points", data: extractListItems(node) });
      index += 1;
      continue;
    }

    if (node.type === "table") {
      const bodyRows = extractTableRows(node).slice(1);

      if (bodyRows.length) {
        slide.content.push({ type: tableTypeFromLayout(layout), data: bodyRows });
      }

      index += 1;
      continue;
    }

    index += 1;
  }
}

function tableTypeFromLayout(layout) {
  if (layout === "stack") return "stack";
  if (layout === "nav") return "nav";
  if (layout === "timeline") return "timeline";
  return "grid";
}

function parseDualColumns(nodes) {
  const sections = [];
  let index = 0;

  while (index < nodes.length) {
    const node = nodes[index];

    if (node.type !== "heading" || node.depth !== 2) {
      break;
    }

    const section = { title: extractText(node), items: [] };

    index += 1;

    while (index < nodes.length) {
      const nextNode = nodes[index];

      if (nextNode.type === "heading" && nextNode.depth === 2) {
        break;
      }

      if (nextNode.type === "list") {
        section.items.push(...extractListItems(nextNode));
        index += 1;
      } else {
        break;
      }
    }

    sections.push(section);
  }

  if (sections.length < 2) {
    throw new Error("Dual-column slides require at least two level-two headings.");
  }

  return {
    data: {
      leftTitle: sections[0].title,
      leftItems: sections[0].items,
      rightTitle: sections[1].title,
      rightItems: sections[1].items
    },
    consumed: index
  };
}

function extractListItems(node) {
  return node.children.map((item) => extractText(item));
}

function extractTableRows(node) {
  return node.children.map((row) => row.children.map((cell) => extractText(cell)));
}

function extractText(node) {
  if (!node) {
    return "";
  }

  if (node.type === "text" || node.type === "inlineCode") {
    return node.value;
  }

  if (node.type === "break") {
    return " ";
  }

  if (!node.children) {
    return "";
  }

  return node.children
    .map((child) => extractText(child))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

function requireString(value, message) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(message);
  }

  return value;
}