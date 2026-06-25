package pages;

import io.appium.java_client.AppiumBy;
import io.appium.java_client.android.AndroidDriver;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.remote.RemoteWebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class SignUpPage {

    private static final int STEP_PAUSE_MS = Integer.parseInt(
            System.getenv().getOrDefault("STEP_PAUSE_MS", "1500")
    );

    private final AndroidDriver driver;
    private final WebDriverWait wait;
    private final WebDriverWait shortWait;

    public SignUpPage(AndroidDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(25));
        this.shortWait = new WebDriverWait(driver, Duration.ofSeconds(12));
    }

    public void restartApp() {
        log("Restarting app...");
        driver.terminateApp("com.sagradago.sagramob");
        pause();
        driver.activateApp("com.sagradago.sagramob");
        pause(3000);
    }

    public void goToSignUpScreen() {
        acceptNotificationPermission();
        waitForGetStartedScreen();

        log("Tapping 'Sign Up' on Get Started screen...");
        clickFirstVisible(
                AppiumBy.accessibilityId("signup-getstarted-button"),
                By.xpath("//*[@text='Sign Up']")
        );
        pause();

        wait.until(ExpectedConditions.presenceOfElementLocated(
                By.xpath("//*[@text='Create a new account']")
        ));
        log("On sign up screen.");
    }

    public void fillSignUpForm(
            String firstName,
            String lastName,
            String mobile,
            String email,
            String password
    ) {
        ensureOnSignUpScreen();
        log("Filling sign up form...");

        setFieldByTestId("signup-first-name-input", "First Name", 0, firstName);
        log("Entered first name.");
        pause();

        setFieldByTestId("signup-last-name-input", "Last Name", 1, lastName);
        log("Entered last name.");
        pause();

        setFieldByTestId("signup-contact-input", "Contact Number", 2, mobile);
        log("Entered contact number.");
        pause();

        selectBirthday(1999, "Oct", 10);
        log("Selected birthday: October 10, 1999.");
        pause();

        scrollDown();
        setFieldByTestId("signup-email-input", "Email", 3, email);
        log("Entered email.");
        pause();

        setFieldByTestId("signup-password-input", "Password", 4, password);
        log("Entered password.");
        pause();

        scrollDown();
        setFieldByTestId("signup-confirm-password-input", "Confirm Password", 5, password);
        log("Entered confirm password.");
        pause();

        hideKeyboardIfShown();
    }

    public void tapSignUp() {
        ensureOnSignUpScreen();
        hideKeyboardIfShown();
        scrollToSubmitButton();
        log("Tapping Sign Up button...");
        clickFirstVisible(
                AppiumBy.accessibilityId("signup-submit-button"),
                AppiumBy.accessibilityId("Sign Up Submit"),
                By.xpath("(//*[@text='Sign Up'])[last()]"),
                AppiumBy.androidUIAutomator(
                        "new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(" +
                                "new UiSelector().text(\"Sign Up\").instance(1))"
                )
        );
        pause(2000);
    }

    public void assertSignUpSuccess() {
        log("Waiting for sign up result...");
        long deadline = System.currentTimeMillis() + 30_000;
        while (System.currentTimeMillis() < deadline) {
            if (!driver.findElements(By.xpath("//*[contains(@text,'Successfully signed up')]")).isEmpty()) {
                log("Sign up successful.");
                dismissMessageModal();
                pause(3000);
                return;
            }

            if (!driver.findElements(By.xpath("//*[contains(@text,'already registered')]")).isEmpty()) {
                dismissMessageModal();
                throw new AssertionError(
                        "Sign up failed: email or contact number is already registered."
                );
            }

            pause(500);
        }

        throw new AssertionError("Sign up result modal did not appear.");
    }

    private void selectBirthday(int year, String monthLabel, int day) {
        clickFirstVisible(
                AppiumBy.accessibilityId("signup-birthday-button"),
                By.xpath("//*[contains(@text,'Birthday')]")
        );
        pause();

        shortWait.until(ExpectedConditions.presenceOfElementLocated(
                By.xpath("//*[@text='Select Birthday']")
        ));

        selectPickerValue(0, String.valueOf(year));
        selectPickerValue(1, monthLabel);
        selectPickerValue(2, String.valueOf(day));

        clickFirstVisible(By.xpath("//*[@text='Confirm']"));
        pause();

        shortWait.until(ExpectedConditions.presenceOfElementLocated(
                By.xpath("//*[contains(@text,'" + year + "-10-10')]")
        ));
    }

    private void selectPickerValue(int spinnerIndex, String value) {
        log("Selecting " + value + "...");
        try {
            WebElement spinner = driver.findElement(AppiumBy.androidUIAutomator(
                    "new UiSelector().className(\"android.widget.Spinner\").instance(" + spinnerIndex + ")"
            ));
            spinner.click();
            pause(800);
        } catch (Exception ignored) {
            // Picker may already expose values directly on screen.
        }

        clickFirstVisible(
                By.xpath("//*[@text='" + value + "']"),
                AppiumBy.androidUIAutomator("new UiSelector().text(\"" + value + "\")")
        );
        pause();
    }

    private void setFieldByTestId(
            String testId,
            String accessibilityLabel,
            int editTextInstance,
            String value
    ) {
        WebElement field = waitForAnyElement(
                AppiumBy.accessibilityId(testId),
                AppiumBy.accessibilityId(accessibilityLabel),
                AppiumBy.androidUIAutomator(
                        "new UiSelector().className(\"android.widget.EditText\").instance(" + editTextInstance + ")"
                )
        );
        setFieldText(field, value);
    }

    private void scrollDown() {
        try {
            driver.findElement(AppiumBy.androidUIAutomator(
                    "new UiScrollable(new UiSelector().scrollable(true)).scrollForward()"
            ));
        } catch (Exception e) {
            driver.executeScript("mobile: scrollGesture", Map.of(
                    "left", 540,
                    "top", 1200,
                    "width", 200,
                    "height", 600,
                    "direction", "down",
                    "percent", 0.75
            ));
        }
        pause(500);
    }

    private void scrollToSubmitButton() {
        scrollDown();
        scrollDown();
    }

    private void setFieldText(WebElement element, String text) {
        String elementId = ((RemoteWebElement) element).getId();
        Map<String, Object> args = new HashMap<>();
        args.put("elementId", elementId);
        args.put("text", text == null ? "" : text);
        driver.executeScript("mobile: replaceElementValue", args);
    }

    private void dismissMessageModal() {
        clickFirstVisible(
                By.xpath("//*[@text='OK']"),
                AppiumBy.accessibilityId("OK")
        );
        pause();
    }

    private void ensureOnSignUpScreen() {
        int attempts = 0;
        while (isOnKeyboardSettings() && attempts < 3) {
            log("Leaving keyboard settings screen...");
            driver.navigate().back();
            pause(1000);
            attempts++;
        }
    }

    private void hideKeyboardIfShown() {
        try {
            if (driver.isKeyboardShown()) {
                driver.hideKeyboard();
                pause(500);
            }
        } catch (Exception ignored) {
            if (isOnKeyboardSettings()) {
                driver.navigate().back();
                pause(500);
            }
        }
    }

    private boolean isOnKeyboardSettings() {
        List<WebElement> preferences = driver.findElements(By.xpath("//*[@text='Preferences']"));
        List<WebElement> languages = driver.findElements(By.xpath("//*[@text='Languages']"));
        return !preferences.isEmpty() && !languages.isEmpty();
    }

    private void acceptNotificationPermission() {
        pause(5000);
        if (isOnGetStartedScreen() || isOnSignUpScreen()) {
            log("No notification permission dialog — continuing.");
            return;
        }

        log("Allowing notification permission...");
        driver.executeScript("mobile: clickGesture", Map.of("x", 540, "y", 1280));
        pause(2000);

        if (!isOnGetStartedScreen() && !isOnSignUpScreen()) {
            driver.executeScript("mobile: clickGesture", Map.of("x", 540, "y", 1280));
            pause(2000);
        }
    }

    private void waitForGetStartedScreen() {
        wait.until(ExpectedConditions.presenceOfElementLocated(
                By.xpath("//*[@text='SagradaGo']")
        ));
    }

    private boolean isOnGetStartedScreen() {
        return !driver.findElements(By.xpath("//*[@text='SagradaGo']")).isEmpty();
    }

    private boolean isOnSignUpScreen() {
        return !driver.findElements(By.xpath("//*[@text='Create a new account']")).isEmpty();
    }

    private WebElement waitForAnyElement(By... selectors) {
        long deadline = System.currentTimeMillis() + 20_000;
        while (System.currentTimeMillis() < deadline) {
            for (By selector : selectors) {
                List<WebElement> elements = driver.findElements(selector);
                if (!elements.isEmpty()) {
                    return elements.get(0);
                }
            }
            pause(500);
        }
        throw new RuntimeException("Expected element not found on screen.");
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

        WebElement fallback = waitForAnyElement(selectors);
        fallback.click();
    }

    private void log(String message) {
        System.out.println("[SignUpTest] " + message);
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
