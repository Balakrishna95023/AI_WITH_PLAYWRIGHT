import {test,expect} from "@playwright/test";

import {LoginPage}
from "../pages/LoginPage.js";

import data 
from "../test-data/loginData.json" assert {type:"json"};

import {analyzeFailure}
from "../ai/failureAnalyzer.js";




test(
"Invalid login test",
async({page})=>{


const login =
new LoginPage(page);


try{


await login.goto();


await login.login(
    data.invalidUser.username,
    data.invalidUser.password
);


await expect(
    login.errorMessage
)
.toBeVisible();


}

catch(error){


const aiResult =
await analyzeFailure(
    error.message
);


console.log(
"AI Analysis:",
aiResult
);




throw error;


}


});