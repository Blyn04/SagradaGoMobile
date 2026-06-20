const { remote } = require('webdriverio');

async function main() {
  const driver = await remote({
    hostname: '127.0.0.1',
    port: 4723,
    path: '/',
    capabilities: {
      platformName: 'Android',
      'appium:automationName': 'UiAutomator2',
      'appium:deviceName': 'Android Emulator'
    }
  });

  console.log('Connected to Android!');

  await driver.pause(3000);
  await driver.deleteSession();
}

main();