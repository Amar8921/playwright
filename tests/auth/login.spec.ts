import { test, expect } from '@playwright/test';
import { login } from '../helpers/login';
import logger from '../helpers/utils/logger';

test.describe('Authentication', () => {
  test('should login successfully', async ({ page }) => {
    logger.info('Starting login test...');
    // The login function uses credentials from .env file by default
    logger.info('Calling login helper function...');
    await login(page);

    // Add assertions here to verify successful login, for example:
    logger.info('Asserting dashboard visibility...');
    await expect(page.locator('#LayoutContentSection').getByText('Dashboard')).toBeVisible();
    
    logger.info('Login test completed successfully.');
  });
});