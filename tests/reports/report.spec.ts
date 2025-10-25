import { test, expect } from '@playwright/test';
import { login } from '../helpers/login';
import logger from '../helpers/utils/logger';

test.describe('Reports', () => {
    test.beforeEach(async ({ page }) => {
        logger.info('Logging in...');
        await login(page);
        logger.info('Login successful.');
    });
    test('should navigate to Online Exam report and generate it', async ({ page }) => {
        logger.info('Starting Online Exam report test...');
        await page.getByRole('textbox', { name: 'Search Menu' }).click();
        await page.getByRole('textbox', { name: 'Search Menu' }).fill('report');
        await page.getByRole('textbox', { name: 'Search Menu' }).press('Enter');
        await page.locator('.tree-section').first().click();
        await page.getByText('Online Exam', { exact: true }).click();
        logger.info('Navigated to Online Exam report section.');
        await page.locator('div:nth-child(3) > .tree-node.ng-scope.has-submenu > .tree-sub > div > .tree-node > .tree-content > .tree-section').first().click();
        await page.getByLabel('Select box select').first().click();
        await page.getByRole('option', { name: 'Class 12 - Meshaf' }).locator('div').click();
        await page.getByLabel('Select box select').nth(1).click();
        await page.getByRole('option', { name: 'English' }).locator('div').click();
        await page.getByRole('button', { name: 'View Report' }).click();
        logger.info('Report generated successfully.');
        await page.locator('.a7 > div').click();
        logger.info('Online Exam report test completed successfully.');
    });
});

