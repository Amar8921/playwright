import { test, expect } from '@playwright/test';
import { login } from '../helpers/login';
import logger from '../helpers/utils/logger';
import { navigateToMenu } from '../helpers/actions/common_actions';

test.describe('AI Chat and Score Prediction', () => {
  // Run login once before all tests in this describe block
  test.beforeEach(async ({ page }) => {
    logger.info('Logging in...');
    await login(page);
    logger.info('Login successful.');
  });

  test('should open chat and send a message', async ({ page }) => {
    logger.info('Starting AI chat test...');

    await test.step('Navigate to AI Chat menu', async () => {
      logger.info('Navigating to AI Chat menu...');
      await navigateToMenu(page, ['score','Eduêgate AI','Score Prediction'],)
    
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
});