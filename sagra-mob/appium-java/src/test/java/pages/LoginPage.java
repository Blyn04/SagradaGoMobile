package pages;

import io.appium.java_client.AppiumBy;
import io.appium.java_client.android.AndroidDriver;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.List;
import java.util.Map;

public class LoginPage {

    private static final int STEP_PAUSE_MS = Integer.parseInt(
            System.getenv().getOrDefault("STEP_PAUSE_MS", "1500")
    );

    private final AndroidDriver driver;
    private final WebDriverWait wait;
    private final WebDriverWait shortWait;

    public LoginPage(AndroidDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(20));
        this.shortWait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    public void restartApp() {
        log("Restarting app...");
        driver.terminateApp("com.sagradago.sagramob");
        pause();
        driver.activateApp("com.sagradago.sagramob");
        pause(3000);
    }

    public void goToLoginScreen() {
        if (isOnLoginScreen()) {
            log("Already on login screen.");
            return;
        }

        acceptNotificationPermission();
        waitForGetStartedOrLogin();

        if (isOnLoginScreen()) {
            log("Already on login screen.");
            return;
        }

        log("Tapping 'Log In with Account'...");
        clickFirstVisible(
                AppiumBy.accessibilityId("login-with-account-button"),
                AppiumBy.accessibilityId("Log In with Account"),
                AppiumBy.androidUIAutomator("new UiSelector().description(\"Log In with Account\")"),
                AppiumBy.androidUIAutomator("new UiSelector().text(\"Log In with Account\")")
        );
        pause();

        waitForLoginScreen();
        log("On login screen.");
    }

    public void fillLoginForm(String email, String password) {
        log("Filling login form...");
        WebElement emailField = wait.until(ExpectedConditions.presenceOfElementLocated(
                AppiumBy.androidUIAutomator("new UiSelector().className(\"android.widget.EditText\").instance(0)")
        ));
        pause();
        emailField.click();
        emailField.clear();
        if (email != null && !email.isEmpty()) {
            emailField.sendKeys(email);
            log("Entered email.");
        }
        pause();

        WebElement passwordField = driver.findElement(
                AppiumBy.androidUIAutomator("new UiSelector().className(\"android.widget.EditText\").instance(1)")
        );
        passwordField.click();
        passwordField.clear();
        if (password != null && !password.isEmpty()) {
            passwordField.sendKeys(password);
            log("Entered password.");
        }
        pause();
    }

    public void tapLogin() {
        log("Tapping Login button...");
        clickFirstVisible(
                AppiumBy.accessibilityId("Login"),
                By.xpath("//*[@text='Login']"),
                AppiumBy.androidUIAutomator("new UiSelector().text(\"Login\")")
        );
        pause();
    }

    public void assertEmptyFieldsError() {
        log("Checking empty-fields validation...");
        shortWait.until(ExpectedConditions.presenceOfElementLocated(
                By.xpath("//*[@text='Login Error']")
        ));
        shortWait.until(ExpectedConditions.presenceOfElementLocated(
                By.xpath("//*[contains(@text,'Please enter both email and password')]")
        ));
        log("Empty-fields validation passed.");
        pause();
    }

    public void dismissErrorModal() {
        log("Dismissing error modal...");
        List<WebElement> okButtons = driver.findElements(AppiumBy.accessibilityId("OK"));
        for (WebElement ok : okButtons) {
            if (ok.isDisplayed()) {
                ok.click();
                pause();
                return;
            }
        }
    }

    public void assertLoginSuccess() {
        log("Waiting for home screen...");
        wait.until(ExpectedConditions.presenceOfElementLocated(
                By.xpath("//*[contains(@text,'Welcome,')]")
        ));
        log("Login successful — home screen displayed.");
        pause(3000);
    }

    private void acceptNotificationPermission() {
        pause(5000);
        if (isOnGetStartedScreen() || isOnLoginScreen()) {
            log("No notification permission dialog — continuing.");
            return;
        }

        log("Allowing notification permission...");
        driver.executeScript("mobile: clickGesture", Map.of("x", 540, "y", 1280));
        pause(2000);

        if (!isOnGetStartedScreen() && !isOnLoginScreen()) {
            driver.executeScript("mobile: clickGesture", Map.of("x", 540, "y", 1280));
            pause(2000);
        }
    }

    private void waitForGetStartedOrLogin() {
        long deadline = System.currentTimeMillis() + 45_000;
        By[] selectors = {
                By.xpath("//*[@text='SagradaGo']"),
                AppiumBy.accessibilityId("Log In with Account"),
                By.xpath("//*[@text='Log In with Account']"),
                By.xpath("//*[@text='Welcome!']")
        };

        while (System.currentTimeMillis() < deadline) {
            for (By selector : selectors) {
                if (!driver.findElements(selector).isEmpty()) {
                    return;
                }
            }
            pause(2000);
        }
        throw new RuntimeException("Get Started or Login screen did not appear in time.");
    }

    private void waitForLoginScreen() {
        wait.until(ExpectedConditions.presenceOfElementLocated(
                By.xpath("//*[@text='Welcome!']")
        ));
    }

    private boolean isOnLoginScreen() {
        return !driver.findElements(By.xpath("//*[@text='Welcome!']")).isEmpty();
    }

    private boolean isOnGetStartedScreen() {
        return !driver.findElements(By.xpath("//*[@text='SagradaGo']")).isEmpty();
    }

    private void clickFirstVisible(By... selectors) {
        for (By selector : selectors) {
            List<WebElement> elements = driver.findElements(selector);
            for (WebElement element : elements) {
                if (element.isDisplayed()) {
                    element.click();
                    return;
                }
            }
        }

        WebElement fallback = wait.until(ExpectedConditions.elementToBeClickable(
                AppiumBy.accessibilityId("login-with-account-button")
        ));
        fallback.click();
    }

    private void log(String message) {
        System.out.println("[LoginTest] " + message);
    }

    private void pause() {
        pause(STEP_PAUSE_MS);
    }

    private void pause(long millis) {
        try {
            Thread.sleep(millis);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException(e);
        }
    }
}
