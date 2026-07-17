const fs = require("fs");
const path = require("path");
const { extractElements } = require("./parseHTML");

const htmlPath = path.resolve(__dirname, "page.html");
const outputPath = path.resolve(__dirname, "elements.json");

function buildElementsJson() {
    const elements = extractElements(htmlPath);
    const documents = elements.map((element, index) => ({
        id: String(index + 1),
        content: `
Element Type: ${element.tag}
Text: ${element.text}
ID: ${element.id}
Name: ${element.name}
Type: ${element.type}
Placeholder: ${element.placeholder}
ARIA Label: ${element.ariaLabel}
Class: ${element.class}
Value: ${element.value}
Href: ${element.href}
Title: ${element.title}
Role: ${element.role}
`,
        metadata: {
            tag: element.tag,
            id: element.id,
            name: element.name,
            type: element.type,
            placeholder: element.placeholder,
            ariaLabel: element.ariaLabel,
            class: element.class,
            value: element.value,
            href: element.href,
            title: element.title,
            role: element.role,
            text: element.text
        }
    }));

    fs.writeFileSync(outputPath, JSON.stringify(documents, null, 2));
    console.log(`Created ${documents.length} documents at ${outputPath}`);
    return documents;
}

if (require.main === module) {
    buildElementsJson();
}

module.exports = { buildElementsJson };