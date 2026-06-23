package base;

import io.appium.java_client.android.AndroidDriver;
import io.appium.java_client.android.options.UiAutomator2Options;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;

import java.net.URI;

public class BaseTest {

    protected AndroidDriver driver;

    @BeforeMethod
    public void setup() throws Exception {
        String appiumServerUrl = System.getenv().getOrDefault(
                "APPIUM_SERVER_URL",
                "http://127.0.0.1:4723"
        );

        UiAutomator2Options options = new UiAutomator2Options()
                .setPlatformName("Android")
                .setAutomationName("UiAutomator2")
                .setDeviceName("Android Emulator")
                .setAppPackage("com.sagradago.sagramob")
                .setAppActivity("com.sagradago.sagramob.MainActivity")
                .setNoReset(true);

        driver = new AndroidDriver(URI.create(appiumServerUrl).toURL(), options);
    }

    @AfterMethod(alwaysRun = true)
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
}
