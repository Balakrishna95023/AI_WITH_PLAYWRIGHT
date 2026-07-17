const { ChromaClient } = require("chromadb");
const { createEmbedding } = require("./embed");

const client = new ChromaClient({
    host: "localhost",
    port: 8000,
    ssl: false
});

async function searchLocator(query) {
    const collection = await client.getOrCreateCollection({
        name: "ui_elements",
        embeddingFunction: null
    });

    const queryVector = await createEmbedding(query);
    const result = await collection.query({
        queryEmbeddings: [queryVector],
        nResults: 1,
        include: ["documents", "metadatas", "distances"]
    });

    const locator = result.metadatas?.[0]?.[0]?.locator || null;

    console.log("Search Query:", query);
    console.log("AI Generated Locator:", locator);

    return locator;
}

if (require.main === module) {
    const query = process.argv.slice(2).join(" ") || "Find the password button";
    searchLocator(query).catch(error => {
        console.error("Error searching locator:", error);
        process.exit(1);
    });
}

module.exports = { searchLocator };
