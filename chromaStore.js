const { ChromaClient } = require("chromadb");
const { createEmbedding } = require("./embed");
const fs = require("fs");
const path = require("path");

const client = new ChromaClient({
    host: "localhost",
    port: 8000,
    ssl: false
});

function buildLocator(metadata) {
    if (metadata.id) {
        return `#${metadata.id}`;
    }

    if (metadata.name) {
        return `${metadata.tag}[name="${metadata.name}"]`;
    }

    if (metadata.ariaLabel) {
        return `${metadata.tag}[aria-label="${metadata.ariaLabel}"]`;
    }

    if (metadata.placeholder) {
        return `${metadata.tag}[placeholder="${metadata.placeholder}"]`;
    }

    if (metadata.text) {
        return `${metadata.tag}:has-text("${metadata.text}")`;
    }

    return metadata.tag;
}

async function storeElements() {
    const collection = await client.getOrCreateCollection({
        name: "ui_elements",
        embeddingFunction: null
    });

    const rawElements = JSON.parse(
        fs.readFileSync(path.resolve(__dirname, "elements.json"), "utf-8")
    );

    const elements = rawElements.map(element => ({
        id: String(element.id),
        text: element.content,
        metadata: element.metadata,
        locator: buildLocator(element.metadata)
    }));

    for (const element of elements) {
        const vector = await createEmbedding(element.text);
        await collection.add({
            ids: [element.id],
            embeddings: [vector],
            documents: [element.text],
            metadatas: [
                {
                    locator: element.locator,
                    ...element.metadata
                }
            ]
        });
        // console.log("Stored:", element.text);
    }

    console.log("Completed");
}

if (require.main === module) {
    storeElements().catch(error => {
        console.error("Error storing elements:", error);
        process.exit(1);
    });
}

module.exports = { storeElements };
