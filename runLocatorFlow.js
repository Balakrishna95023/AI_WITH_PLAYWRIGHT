const { buildElementsJson } = require("./change_to_meaning_full_json");
const { storeElements } = require("./chromaStore");
const { searchLocator } = require("./searchLocator");

async function main() {
    buildElementsJson();
    await storeElements();

    const query = process.argv.slice(2).join(" ") || "Find the password button";
    const locator = await searchLocator(query);

    if (locator) {
        console.log(`Locator for query \"${query}\": ${locator}`);
    } else {
        console.log(`No locator found for query: ${query}`);
    }
}

main().catch(error => {
    console.error("Error running locator flow:", error);
    process.exit(1);
});

`Example Output of above code is as follows:

[Running] node "d:/pycharmRobot/AI_with_playwright/runLocatorFlow.js"
Created 168 documents at d:/pycharmRobot/AI_with_playwright/elements.json
Completed
Search Query: Find the password button
AI Generated Locator: #password
Locator for query "Find the password button": #password

[Done] exited with code=0 in 134.719 seconds`