import { allure } from "allure-playwright";


export async function addAIReport(data){


await allure.attachment(
    "AI Failure Analysis",
    JSON.stringify(data,null,2),
    "application/json"
);


}