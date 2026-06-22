package base;

import io.appium.java_client.android.AndroidDriver;
import org.openqa.selenium.remote.DesiredCapabilities;
import io.appium.java_client.android.options.UiAutomator2Options;

import java.net.URL;

public class BaseTest {

    protected AndroidDriver driver;

    public void setup() throws Exception {

        DesiredCapabilities caps =
                new DesiredCapabilities();

        caps.setCapability("platformName", "Android");
        caps.setCapability("automationName", "UiAutomator2");
        caps.setCapability("deviceName", "Android Emulator");

        caps.setCapability(
                "appPackage",
                "com.sagradago.sagramob"
        );

        caps.setCapability(
                "appActivity",
                "com.sagradago.sagramob.MainActivity"
        );

        driver = new AndroidDriver(
                new URL("http://127.0.0.1:4723"),
                caps
        );
    }
}