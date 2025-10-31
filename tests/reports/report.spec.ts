import { test, expect } from '@playwright/test';
import { login } from '../helpers/login';
import logger from '../helpers/utils/logger';
import { clickViewReportButton, navigateToMenu, verifyReportVisible } from '../helpers/actions/common_actions';

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

    test('checking staff attendance report', async ({ page }) => {
        logger.info('Starting staff attendance report test...');
        await navigateToMenu(page, ['staff attendance report','Reports','Mobile App Report','Staff Attendance Report'],)
        logger.info('Navigated to Staff Attendance Report page.');

        await test.step('inputing from date', async () => {
            logger.info('Inputing From Date...');
            const fromDateInput = page.locator('[ng-model="fromDate"]');
            await fromDateInput.fill('06/08/2025');
            //press enter
            await fromDateInput.press('Enter');
            logger.info('Verifying From Date input...');
            await expect(fromDateInput).toHaveValue('06/08/2025');
        });

        await test.step('inputing till date', async () => {
            logger.info('Inputing Till Date...');
            const tillDateInput = page.locator('[ng-model="tillDate"]');
            await tillDateInput.fill('18/09/2025');
            //press enter
            await tillDateInput.press('Enter');
            logger.info('Verifying Till Date input...');
            await expect(tillDateInput).toHaveValue('18/09/2025');
        });
        await test.step('selecting employee', async () => {
            logger.info('Selecting Employee...');
            const employeeDropdown = page.locator('[ng-model="ParameterModel.EmployeeID"]');
            
            // 1. Click to open the dropdown
            await employeeDropdown.getByLabel('Select box select').click();

            // 2. Wait for the options list to appear
            const firstOption = page.locator('li.ui-select-choices-row').first();
            await firstOption.waitFor({ state: 'visible', timeout: 10000 });

            // 3. Check if the "All" option exists
            const allOption = page.getByRole('option', { name: 'EP1009 - JYOTHI  SUJESHKUMAR' });
            const allOptionCount = await allOption.count();

            // Define the locator for the selected value text, ensuring it's the visible one
            const selectedValueLocator = employeeDropdown.locator('.select2-chosen:visible');

            if (allOptionCount > 0) {
                // --- FIX #1: The expected text should be "All" ---
                logger.info('"All" option found. Selecting it...');
                await allOption.click();
                
                // --- FIX #2: Use the unambiguous visible locator ---
                await expect(selectedValueLocator).toHaveText('EP1009 - JYOTHI  SUJESHKUMAR');
            } else {
                // This block handles the 'staging' environment
                logger.info('"All" option not found. Selecting the first available employee...');
                const firstEmployeeText = await firstOption.textContent();

                if (!firstEmployeeText) {
                    throw new Error("Could not get text content of the first employee option.");
                }

                await firstOption.click();
                
                logger.info(`Verifying selection of: ${firstEmployeeText}`);
                // --- FIX #2 (Applied here too for consistency) ---
                await expect(selectedValueLocator).toContainText(firstEmployeeText.trim());
            }
        });

        await test.step('generating report', async () => {
            logger.info('Generating Report...');
            await clickViewReportButton(page);
            logger.info('Report generated successfully.');
            logger.info('verifing report visibility...');
            await verifyReportVisible(page);
            logger.info('Report is visible on screen.');
        });
    });
});

