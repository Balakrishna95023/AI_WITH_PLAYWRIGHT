import { askAI } from "./ollamaClient.js";


export async function analyzeFailure(error) {


const prompt = `

You are a Playwright Automation Expert.

Analyze this failure:

${error}


Return JSON:

{
 "rootCause":"",
 "solution":"",
 "recommendation":""
}

`;

return await askAI(prompt);

}