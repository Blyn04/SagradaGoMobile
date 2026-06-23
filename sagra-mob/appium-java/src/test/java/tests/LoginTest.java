package tests;

import base.BaseTest;
import org.testng.Assert;
import org.testng.annotations.Test;

public class LoginTest extends BaseTest {

    @Test
    public void connectToApp() {
        Assert.assertNotNull(driver.getSessionId(), "Appium session should be created");
        System.out.println("Connected to SagradaGoMobile — session: " + driver.getSessionId());
    }
}
