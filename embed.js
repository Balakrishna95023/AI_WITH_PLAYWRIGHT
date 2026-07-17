const { Ollama } = require("ollama");
const ollama = new Ollama({
    host: "http://localhost:11434"
});
async function createEmbedding(text) {
    const response = await ollama.embed({
        model: "nomic-embed-text",
        input: text
    });
    return response.embeddings[0];
}
// Export function
module.exports = {
    createEmbedding
};