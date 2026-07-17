const cheerio = require("cheerio");
const fs = require("fs");

function extractElements(htmlFile) {
    const html = fs.readFileSync(htmlFile, "utf-8");
    const $ = cheerio.load(html);
    const elements = [];

    $("button, input, textarea, select, a").each((_, element) => {
        const $element = $(element);
        const attribs = element.attribs || {};
        const tag = element.tagName.toLowerCase();

        elements.push({
            tag,
            text: $element.text().trim(),
            id: attribs.id || "",
            name: attribs.name || "",
            type: attribs.type || "",
            placeholder: attribs.placeholder || "",
            ariaLabel: attribs["aria-label"] || "",
            class: attribs.class || "",
            value: attribs.value || "",
            href: attribs.href || "",
            title: attribs.title || "",
            role: attribs.role || ""
        });
    });

    return elements;
}

module.exports = { extractElements };