package tests;

import base.BaseTest;
import org.testng.Assert;
import org.testng.annotations.Test;
import pages.LoginPage;
import utils.EnvUtils;

public class LoginTest extends BaseTest {

    private static final String TEST_EMAIL = EnvUtils.get("TEST_EMAIL");
    private static final String TEST_PASSWORD = EnvUtils.get("TEST_PASSWORD");

    @Test
    public void loginFlow() {
        LoginPage loginPage = new LoginPage(driver);

        loginPage.restartApp();
        loginPage.goToLoginScreen();

        loginPage.fillLoginForm("", "");
        loginPage.tapLogin();
        loginPage.assertEmptyFieldsError();
        loginPage.dismissErrorModal();

        if (!TEST_EMAIL.isEmpty() && !TEST_PASSWORD.isEmpty()) {
            System.out.println("[LoginTest] Running full login for " + TEST_EMAIL);
            loginPage.fillLoginForm(TEST_EMAIL, TEST_PASSWORD);
            loginPage.tapLogin();
            loginPage.assertLoginSuccess();
        } else {
            System.out.println("[LoginTest] Skipping full login — add TEST_EMAIL and TEST_PASSWORD to sagra-mob/.env");
        }

        Assert.assertNotNull(driver.getSessionId());
        System.out.println("[LoginTest] All login interactions completed.");
    }
}
