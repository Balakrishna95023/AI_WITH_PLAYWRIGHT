import {askAI} from "./ollamaClient.js";


export async function generateLoginTests(){

const prompt = `

You are a Senior SDET.

Generate Playwright test scenarios for login.

Application:
Banking application

Requirements:
- Username mandatory
- Password mandatory
- Invalid login should show error
- Account locks after 5 failures

Return JSON:

{
"tests":[
{
"title":"",
"priority":"",
"steps":[],
"expected":""
}
]
}

`;

return await askAI(prompt);

}