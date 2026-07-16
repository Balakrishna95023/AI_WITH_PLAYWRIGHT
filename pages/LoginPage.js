export class LoginPage {


constructor(page){

    this.page = page;

    this.username =
        page.locator("#username");

    this.password =
        page.locator("#password");

    this.loginButton =
        page.locator("#login");

    this.errorMessage =
        page.locator(".error");
}



async goto(){

    await this.page.goto(
        "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login"
    );

}


async login(username,password){

    await this.username.fill(username);

    await this.password.fill(password);

    await this.loginButton.click();

}

}