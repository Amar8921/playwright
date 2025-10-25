import { test, expect } from '@playwright/test';
import { login } from '../helpers/login';
import logger from '../helpers/utils/logger';

test.describe('AI Chat and Score Prediction', () => {
  // Run login once before all tests in this describe block
  test.beforeEach(async ({ page }) => {
    logger.info('Logging in...');
    await login(page);
    logger.info('Login successful.');
  });

  test('should open chat and send a message', async ({ page }) => {
    logger.info('Starting AI chat test...');

    // Ensure we are past the login page and app shell is ready
    logger.info('Waiting for post-login URL...');
    await page.waitForURL((url) => !/\/Account\/Login/i.test(url.pathname), { timeout: 30000 });
    await page.waitForLoadState('domcontentloaded');

    // Prefer a stable control present across modules, e.g. global search
    const searchMenu = page.getByRole('textbox', { name: 'Search Menu' });
    const dashboardHeading = page.getByText('Dashboard');
    const shellReady = await Promise.race([
      searchMenu.isVisible({ timeout: 5000 }).then(() => true).catch(() => false),
      dashboardHeading.isVisible({ timeout: 5000 }).then(() => true).catch(() => false),
    ]);
    if (!shellReady) {
      logger.info('App shell controls not detected yet, proceeding with cautious chat open attempts...');
    }

    // Attempt to open chat with robust locators and fallbacks
    logger.info('Opening chat...');
    const possibleChatButtons = [
      page.getByRole('button', { name: /open chat/i }),
      page.getByRole('button', { name: /chat/i }),
      page.getByRole('button', { name: /ai chat/i }),
      page.getByLabel(/open chat|chat|ai chat/i),
    ];

    let opened = false;
    for (const btn of possibleChatButtons) {
      const visible = await btn.isVisible({ timeout: 3000 }).catch(() => false);
      if (visible) {
        await btn.click();
        opened = true;
        break;
      }
    }

    if (!opened) {
      // Fallback: use the global search to navigate to chat if available
      logger.info('Chat button not found, trying via Search Menu...');
      const searchInput = page.getByRole('textbox', { name: 'Search Menu' });
      const hasSearch = await searchInput.isVisible({ timeout: 3000 }).catch(() => false);
      if (hasSearch) {
        await searchInput.fill('chat');
        await searchInput.press('Enter');
        // Try likely navigation path entries
        const aiMenu = page.getByText('Eduêgate AI', { exact: true });
        if (await aiMenu.isVisible({ timeout: 5000 }).catch(() => false)) {
          await aiMenu.click();
        }
        const chatMenu = page.getByText(/chat/i);
        if (await chatMenu.isVisible({ timeout: 5000 }).catch(() => false)) {
          await chatMenu.click();
          opened = true;
        }
      }
    }

    if (!opened) {
      // Capture a screenshot to help debugging locator issues
      logger.error('Failed to locate chat opener. Capturing screenshot...');
      await page.screenshot({ path: 'chat_open_failure.png', fullPage: true });
      throw new Error('Chat opener not found');
    }

    const chatInput = page.getByRole('textbox', { name: 'Type your question here..' });
    await expect(chatInput).toBeVisible({ timeout: 15000 });
    logger.info('Chat opened successfully.');

    // Send a message
    logger.info('Sending a message...');
    await chatInput.click();
    await chatInput.fill('hi');
    await chatInput.press('Enter');
    
    await expect(page.getByText('What do you want to do?')).toBeVisible(); 
    logger.info('Message sent and response received.');
    logger.info('AI chat test completed successfully.');
  });

  test('should navigate to Score Prediction and select a student', async ({ page }) => {
    logger.info('Starting Score Prediction test...');
    
    const searchInput = page.getByRole('textbox', { name: 'Search Menu' });

    // 1. Fill the search input and press Enter
    await searchInput.fill('score prediction');
    await searchInput.press('Enter');
    await page.getByText('Eduêgate AI', { exact: true }).click();
    await page.getByText('Score Prediction').click();
    
    logger.info('Navigated to Score Prediction page.');
    await page.getByLabel('Select box select').click();
    const studentSearchInput = page.getByRole('combobox', { name: 'Select box' });
    await studentSearchInput.click();
    
    const studentId = process.env.STUDENT_ID;
    if (!studentId) {
      throw new Error('STUDENT_ID is not defined in the environment file.');
    }
    await studentSearchInput.fill(studentId);
    await studentSearchInput.press('Enter');

    await page.getByText(new RegExp(studentId)).click();
    
    await expect(page.getByText('Subject Wise Prediction')).toBeVisible({ timeout: 15000 });
    await page.getByText('Subject Wise Prediction').click();
    
    logger.info('Score Prediction test completed successfully.');
  });
});