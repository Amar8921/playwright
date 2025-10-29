import { test, expect } from '@playwright/test';
import { login } from '../helpers/login';
import logger from '../helpers/utils/logger';
import { waitForToast } from '../helpers/utils/ui';
import { navigateToMenu } from '../helpers/actions/common_actions';

test.describe('Timetable Testing', () => {
    test.beforeEach(async ({ page }) => {
        await test.step('Login to the app', async () => {
            logger.info('Logging in...');
            await login(page);
            logger.info('Login successful.');
        });
    });

    test('Timetable Generation', async ({ page }) => {
        await test.step('Navigate to Timetable Generation menu', async () => {
            logger.info('Navigating to Timetable Generation menu...');
            await navigateToMenu(page, ['time', 'Schools', 'Time Table','Time Tables']);
            logger.info('Navigation to Timetable Generation menu successful.');
        });

        await test.step('clicking Create Time Table button', async () => {
            logger.info('Clicking Create Time Table button...');
            await page.getByTitle('Create Time Table Allocation').first().click();
            logger.info('Create Time Table button clicked successfully.');
        });
    });
});