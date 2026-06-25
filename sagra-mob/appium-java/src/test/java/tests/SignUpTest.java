package tests;

import base.BaseTest;
import org.testng.Assert;
import org.testng.annotations.Test;
import pages.SignUpPage;
import utils.EnvUtils;

public class SignUpTest extends BaseTest {

    private static final String TEST_EMAIL = EnvUtils.get("TEST_EMAIL");
    private static final String TEST_PASSWORD = EnvUtils.get("TEST_PASSWORD");
    private static final String TEST_FIRSTNAME = EnvUtils.get("TEST_FIRSTNAME");
    private static final String TEST_LASTNAME = EnvUtils.get("TEST_LASTNAME");
    private static final String TEST_MOBILE = EnvUtils.get("TEST_MOBILE");

    @Test
    public void signUpFlow() {
        Assert.assertFalse(TEST_EMAIL.isEmpty(), "TEST_EMAIL is required in sagra-mob/.env");
        Assert.assertFalse(TEST_PASSWORD.isEmpty(), "TEST_PASSWORD is required in sagra-mob/.env");
        Assert.assertFalse(TEST_FIRSTNAME.isEmpty(), "TEST_FIRSTNAME is required in sagra-mob/.env");
        Assert.assertFalse(TEST_LASTNAME.isEmpty(), "TEST_LASTNAME is required in sagra-mob/.env");
        Assert.assertFalse(TEST_MOBILE.isEmpty(), "TEST_MOBILE is required in sagra-mob/.env");

        SignUpPage signUpPage = new SignUpPage(driver);

        signUpPage.restartApp();
        signUpPage.goToSignUpScreen();
        signUpPage.fillSignUpForm(
                TEST_FIRSTNAME,
                TEST_LASTNAME,
                TEST_MOBILE,
                TEST_EMAIL,
                TEST_PASSWORD
        );
        signUpPage.tapSignUp();
        signUpPage.assertSignUpSuccess();

        Assert.assertNotNull(driver.getSessionId());
        System.out.println("[SignUpTest] Sign up automation completed.");
    }
}
