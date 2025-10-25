import { Page } from '@playwright/test';
import logger from './utils/logger';

/**
 * A helper function to handle the login process for the application.
 * @param page - The Playwright Page object.
 * @param username - The username for login.
 * @param password - The password for login.
 */
export async function login(page: Page, username?: string, password?: string) {
  logger.info('Starting login process...');

  const user = username || process.env.APP_USERNAME;
  const pass = password || process.env.APP_PASSWORD;
  const baseUrl = process.env.BASE_URL;

  if (!user || !pass) {
    const errorMessage = 'Username or password is not defined. Please check your environment variables (APP_USERNAME, APP_PASSWORD) or pass them as arguments.';
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }

  if (!baseUrl) {
    const errorMessage = 'BASE_URL is not defined. Please set it in the environment (e.g. .env.staging)';
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }

  try {
    const loginUrl = `${baseUrl}/Account/Login?ReturnUrl=%2F%3Flanguage%3Den`;
    logger.info(`Navigating to login page: ${loginUrl}`);
    await page.goto(loginUrl, { waitUntil: 'domcontentloaded' });

    // Fill in credentials using the correct selectors for your application
    await page.getByRole('textbox', { name: 'Email' }).fill(user);
    await page.getByRole('textbox', { name: 'Password' }).fill(pass);
    await page.getByRole('button', { name: 'Log In' }).click();

    // Wait for post-login state: either dashboard appears or a context selection with a "Select" button.
    logger.info('Waiting for post-login UI or context selection...');

    // Prefer to click a visible and enabled Select button if a context selection screen is shown
    const selectButtons = page.getByRole('button', { name: /select/i });
    try {
      // Give the selection screen time to render
      await selectButtons.first().waitFor({ state: 'visible', timeout: 20000 });
      const count = await selectButtons.count();
      for (let i = 0; i < count; i++) {
        const candidate = selectButtons.nth(i);
        const [isVisible, isEnabled] = await Promise.all([
          candidate.isVisible().catch(() => false),
          candidate.isEnabled().catch(() => false),
        ]);
        if (isVisible && isEnabled) {
          logger.info(`Context selection detected. Clicking Select button #${i + 1}...`);
          await candidate.scrollIntoViewIfNeeded().catch(() => {});
          await candidate.click();
          // Wait for selection UI to disappear
          await candidate.waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {});
          break;
        }
      }
    } catch (_e) {
      // No visible Select button within timeout; continue
      logger.info('No context selection UI detected; proceeding.');
    }

    // Ensure we have landed past the login page. Adjust selector to your app's landing marker if needed.
    await page.waitForLoadState('domcontentloaded');
    logger.info('Login process completed successfully.');
  } catch (error) {
    logger.error('An error occurred during the login process.', { error });
    // Re-throw the error to fail the test
    throw error;
  }
}
