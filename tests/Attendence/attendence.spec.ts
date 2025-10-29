import { test, expect } from '@playwright/test';
import { login } from '../helpers/login';
import logger from '../helpers/utils/logger';
import { waitForToast } from '../helpers/utils/ui';
import { log } from 'console';
import { navigateToMenu } from '../helpers/actions/common_actions';


test.describe('Attendence', () => {
    test.beforeEach(async ({ page }) => {
        await test.step('Login to the app', async () => {
            logger.info('Logging in...');
            await login(page);
            logger.info('Login successful.');
        });
    });

    test('should attendence checking', async ({ page }) => {
        logger.info('Starting attendence checking...');

        await test.step('Navigate to Attendence menu', async () => {
            logger.info('Navigating to Attendence menu...');
            await navigateToMenu(page, ['attend', 'Attendance', 'Student Attendance']);
            logger.info('Navigation to Attendence menu successful.');
        

            logger.info('Filling class field...');
            const classDropdown = page.locator('[ng-model="selectedClass"]');
            await classDropdown.getByLabel('Select box select').click();
            await page.locator('.ui-select-dropdown .select2-results').getByText('Class 1 - Meshaf').click();
            logger.info('Class selected.');

            logger.info('Filling class field...');
            const sectionDropdown = page.locator('[ng-model="selectedSection"]');
            await sectionDropdown.getByLabel('Select box select').click();
            await page.locator('.ui-select-dropdown .select2-results').getByText('MA').click();
            logger.info('Section selected.');

            logger.info('Clicking mark all button...');
            await page.locator('#markallButton').click();
            logger.info('Mark all button clicked.');

            logger.info('click send attendance for parents')
            await page.locator('#notificationButtonforParent').click();
            logger.info('Send attendance for parents clicked.');



    });
});
});


