package tests;

import base.BaseTest;
import org.testng.annotations.Test;

public class LoginTest extends BaseTest {

    @Test
    public void connectToApp() throws Exception {

        setup();

        System.out.println("Connected to SagradaGoMobile");

        Thread.sleep(5000);

        driver.quit();
    }
}