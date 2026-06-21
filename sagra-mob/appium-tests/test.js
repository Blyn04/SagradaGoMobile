const { remote } = require('webdriverio');

const TEST_EMAIL = process.env.TEST_EMAIL || '';
const TEST_PASSWORD = process.env.TEST_PASSWORD || '';
const RUN_FULL_LOGIN = Boolean(TEST_EMAIL && TEST_PASSWORD);

const capabilities = {
  platformName: 'Android',
  'appium:automationName': 'UiAutomator2',
  'appium:deviceName': 'Android Emulator',
  'appium:appPackage': 'com.sagradago.sagramob',
  'appium:appActivity': 'com.sagradago.sagramob.MainActivity',
  'appium:noReset': true,
};

async function waitForLoginScreen(driver) {
  const welcome = await driver.$('android=new UiSelector().text("Welcome!")');
  await welcome.waitForDisplayed({ timeout: 15000 });
}

async function isOnLoginScreen(driver) {
  const welcome = await driver.$('android=new UiSelector().text("Welcome!")');
  return welcome.isDisplayed().catch(() => false);
}

async function isOnGetStartedScreen(driver) {
  const title = await driver.$('android=new UiSelector().text("SagradaGo")');
  return title.isDisplayed().catch(() => false);
}

async function tapAllowNotificationButton(driver) {
  await driver.execute('mobile: clickGesture', { x: 540, y: 1280 });
}

async function acceptNotificationPermission(driver) {
  await driver.pause(5000);

  if (await isOnGetStartedScreen(driver) || await isOnLoginScreen(driver)) {
    console.log('No notification permission dialog — continuing.');
    return;
  }

  await tapAllowNotificationButton(driver);
  console.log('Notification permission allowed.');
  await driver.pause(2000);

  if (!(await isOnGetStartedScreen(driver)) && !(await isOnLoginScreen(driver))) {
    await tapAllowNotificationButton(driver);
    await driver.pause(2000);
  }
}

async function clickLogInWithAccount(driver) {
  const selectors = [
    '~login-with-account-button',
    '~Log In with Account',
    'android=new UiSelector().description("Log In with Account")',
    'android=new UiSelector().text("Log In with Account")',
  ];

  for (const selector of selectors) {
    const button = await driver.$(selector);
    if (await button.isDisplayed().catch(() => false)) {
      await button.click();
      return;
    }
  }

  const loginButton = await driver.$('~login-with-account-button');
  await loginButton.waitForDisplayed({ timeout: 15000 });
  await loginButton.click();
}

async function waitForGetStartedOrLogin(driver) {
  const selectors = [
    'android=new UiSelector().text("SagradaGo")',
    'android=new UiSelector().description("Log In with Account")',
    'android=new UiSelector().text("Log In with Account")',
    'android=new UiSelector().text("Welcome!")',
  ];

  const deadline = Date.now() + 45000;
  while (Date.now() < deadline) {
    for (const selector of selectors) {
      const element = await driver.$(selector);
      if (await element.isDisplayed().catch(() => false)) {
        return;
      }
    }
    await driver.pause(2000);
  }

  throw new Error('Get Started or Login screen did not appear in time.');
}

async function goToLoginScreen(driver) {
  if (await isOnLoginScreen(driver)) {
    console.log('Already on login screen.');
    return;
  }

  await acceptNotificationPermission(driver);
  await waitForGetStartedOrLogin(driver);

  if (await isOnLoginScreen(driver)) {
    console.log('Already on login screen.');
    return;
  }

  await clickLogInWithAccount(driver);
  await waitForLoginScreen(driver);
  console.log('On login screen.');
}

async function fillLoginForm(driver, email, password) {
  const emailField = await driver.$('android=new UiSelector().className("android.widget.EditText").instance(0)');
  const passwordField = await driver.$('android=new UiSelector().className("android.widget.EditText").instance(1)');

  await emailField.waitForDisplayed({ timeout: 10000 });
  await emailField.click();
  await emailField.clearValue();
  if (email) {
    await emailField.setValue(email);
  }

  await passwordField.click();
  await passwordField.clearValue();
  if (password) {
    await passwordField.setValue(password);
  }
}

async function submitLogin(driver) {
  const loginButton = await driver.$('~Login');
  await loginButton.waitForDisplayed({ timeout: 10000 });
  await loginButton.click();
}

async function assertEmptyFieldsError(driver) {
  const errorTitle = await driver.$('android=new UiSelector().text("Login Error")');
  await errorTitle.waitForDisplayed({ timeout: 10000 });

  const errorMessage = await driver.$(
    'android=new UiSelector().textContains("Please enter both email and password")'
  );
  await errorMessage.waitForDisplayed({ timeout: 5000 });
  console.log('Empty-fields validation passed.');
}

async function assertLoginSuccess(driver) {
  const homeWelcome = await driver.$('android=new UiSelector().textContains("Welcome,")');
  await homeWelcome.waitForDisplayed({ timeout: 20000 });
  console.log('Login successful - home screen displayed.');
}

async function dismissErrorModal(driver) {
  const okButton = await driver.$('~OK');
  if (await okButton.isDisplayed().catch(() => false)) {
    await okButton.click();
  }
}

async function runEmptyFieldsTest(driver) {
  console.log('Running empty-fields login validation test...');
  await fillLoginForm(driver, '', '');
  await submitLogin(driver);
  await assertEmptyFieldsError(driver);
  await dismissErrorModal(driver);
}

async function runFullLoginTest(driver) {
  console.log(`Running full login test for ${TEST_EMAIL}...`);
  await fillLoginForm(driver, TEST_EMAIL, TEST_PASSWORD);
  await submitLogin(driver);
  await assertLoginSuccess(driver);
}

async function main() {
  const driver = await remote({
    hostname: '127.0.0.1',
    port: Number(process.env.APPIUM_PORT || 4724),
    path: '/',
    capabilities,
  });

  try {
    console.log('Connected to Android app.');

    await driver.terminateApp('com.sagradago.sagramob');
    await driver.activateApp('com.sagradago.sagramob');

    await goToLoginScreen(driver);

    await runEmptyFieldsTest(driver);

    if (RUN_FULL_LOGIN) {
      await runFullLoginTest(driver);
    } else {
      console.log('Skipping full login — set TEST_EMAIL and TEST_PASSWORD to run it.');
    }

    console.log('All login tests passed.');
  } catch (error) {
    console.error('Login test failed:', error.message);
    throw error;
  } finally {
    await driver.deleteSession();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
