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
	let index = 0;

	while (index < nodes.length) {
		const node = nodes[index];

		if (node.type === "heading" && node.depth === 1) {
			slide.title = extractText(node);
			index += 1;
			continue;
		}

		if (layout === "dual-columns" && node.type === "heading" && node.depth === 2) {
			slide.dualColumns = parseDualColumns(nodes.slice(index));
			break;
		}

		if (node.type === "paragraph") {
			assignParagraph(slide, extractText(node));
			index += 1;
			continue;
		}

		if (node.type === "blockquote") {
			slide.takeaway ??= extractText(node);
			index += 1;
			continue;
		}

		if (node.type === "list") {
			const items = extractListItems(node);

			if (node.ordered) {
				slide.numberedPoints ??= items;
			} else {
				slide.points ??= items;
			}

			index += 1;
			continue;
		}

		if (node.type === "table") {
			assignTable(slide, layout, extractTableRows(node));
			index += 1;
			continue;
		}

		index += 1;
	}
}

function assignParagraph(slide, text) {
	const value = text.trim();

	if (!value) {
		return;
	}

	if (/^Note:/i.test(value)) {
		slide.note = value.replace(/^Note:\s*/i, "");
		return;
	}

	if (!slide.lead) {
		slide.lead = value;
		return;
	}

	if (!slide.summary) {
		slide.summary = value;
		return;
	}

	slide.note ??= value;
}

function assignTable(slide, layout, rows) {
	const bodyRows = rows.slice(1);

	if (!bodyRows.length) {
		return;
	}

	if (layout === "grid") {
		slide.gridItems = bodyRows.map(([label, text]) => [label, text]);
		return;
	}

	if (layout === "stack") {
		slide.stackItems = bodyRows.map(([label, text]) => [label, text]);
		return;
	}

	if (layout === "nav") {
		slide.navCards = bodyRows.map(([code, label, text, target]) => [code, label, text, target]);
		return;
	}

	if (layout === "timeline") {
		slide.timelineItems = bodyRows.map(([step, text]) => [step, text]);
	}
}

function parseDualColumns(nodes) {
	const sections = [];

	for (let index = 0; index < nodes.length; index += 1) {
		const node = nodes[index];

		if (node.type !== "heading" || node.depth !== 2) {
			continue;
		}

		const section = { title: extractText(node), items: [] };

		index += 1;

		while (index < nodes.length) {
			const nextNode = nodes[index];

			if (nextNode.type === "heading" && nextNode.depth === 2) {
				index -= 1;
				break;
			}

			if (nextNode.type === "list") {
				section.items.push(...extractListItems(nextNode));
			}

			index += 1;
		}

		sections.push(section);
	}

	if (sections.length < 2) {
		throw new Error("Dual-column slides require at least two level-two headings.");
	}

	return {
		leftTitle: sections[0].title,
		leftItems: sections[0].items,
		rightTitle: sections[1].title,
		rightItems: sections[1].items
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