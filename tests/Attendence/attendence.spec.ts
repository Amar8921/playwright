import { test, expect } from '@playwright/test';
import { login } from '../helpers/login';
import logger from '../helpers/utils/logger';
import { waitForToast } from '../helpers/utils/ui';
import { log } from 'console';


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

        await test.step('Navigate to attendence', async () => {
            logger.info('Navigating to attendence menu...');
            const searchBox = page.getByRole('textbox', { name: 'Search Menu' });
            await searchBox.waitFor({ state: 'visible', timeout: 15000 });
            await searchBox.click();
            await searchBox.fill('attendance');
            await searchBox.press('Enter');
        });

        await test.step('selecting school', async () => {
            logger.info('Selecting school...');
            const schoolsNode = page.locator('.tree-section', { hasText: 'Schools' }).first();
            await schoolsNode.waitFor({ state: 'visible', timeout: 10000 });
            await schoolsNode.click();

            logger.info('selecting attendence menu...');
            const feeMenu = page.locator('div.tree-section:has-text("Attendances")').first();
            await feeMenu.waitFor({ state: 'visible', timeout: 10000 });
            await feeMenu.click();

            logger.info('Clicking "Class Wise Attendance"...');
            // The best way is to locate the div.tree-content that contains the span with the text
            const classWiseAttendanceItem = page.locator('div.tree-content', { hasText: 'Class Wise Attendance' }).first();
            await classWiseAttendanceItem.waitFor({ state: 'visible', timeout: 10000 });
            await classWiseAttendanceItem.click();
            logger.info('"Class Wise Attendance" clicked.');

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


