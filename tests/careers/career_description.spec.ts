import { test, expect } from '@playwright/test';
import { login } from '../helpers/login';
import logger from '../helpers/utils/logger';
import { waitForToast } from '../helpers/utils/ui';
import { navigateToCareerMenu } from '../helpers/navigation/carreer_navigation';
import { log } from 'console';


test.describe('Career testing', () => {
    test.beforeEach(async ({ page }) => {
        await test.step('Login to the app', async () => {
            logger.info('Logging in...');
            await login(page);
            logger.info('Login successful.');
        });
    });

    test('create career description', async ({ page }) => {
        logger.info('creating career description  ...');

        await navigateToCareerMenu(page);

        await test.step('clicking job description ', async () => {
            logger.info('Clicking the Job Description  ...');
            const jobDescription = page.locator('div.tree-section:has-text("Job Description")').first();
            await jobDescription.waitFor({ state: 'visible', timeout: 10000 });
            await jobDescription.click();
        });
        await test.step('clicking create button', async () => {
            logger.info('Clicking the Create button...');
            const createButton = page.getByTitle('Create').first();
            await createButton.waitFor({ state: 'visible', timeout: 10000 });
            await createButton.click();
        });
        await test.step('filling career description title ', async () => {
            logger.info('Filling career description title ...');
            const titleInput = page.locator('input[ng-model="CRUDModel.ViewModel.Title"]');;
            await titleInput.waitFor({ state: 'visible' });
            await titleInput.fill('Senior Developer');
            await expect(titleInput).toHaveValue('Senior Developer');
        });
        await test.step('filling reporting to', async () => {
            logger.info('Filling reporting to...');

            // 1. Locate the main dropdown container
            const reportingDropdownContainer = page.locator('[ng-model="CRUDModel.ViewModel.ReportingToEmployee"]');
            
            // 2. Click the main visible part of the dropdown to open it.
            // This is a single-select, so it will have an 'a.select2-choice'
            await reportingDropdownContainer.locator('a.select2-choice').click();
            logger.info('Reporting To dropdown opened.');

            // 3. Find the search input that appeared and type into it to trigger the async search.
            // The input is usually inside the floating dropdown panel.
            const searchInput = page.locator('div.ui-select-dropdown input.ui-select-search');
            await searchInput.fill('JYOTHI');
            logger.info('Typed "JYOTHI" to search for an employee.');

            // 4. IMPORTANT: Wait for the result to load and then click it.
            // We will target the option by its role and visible text.
            const employeeOption = page.getByRole('option', { name: 'EP1009 - JYOTHI SUJESHKUMAR' });
            
            // Use waitFor to make sure it has loaded from the server before trying to click
            await employeeOption.waitFor({ state: 'visible', timeout: 10000 });
            await employeeOption.click();
            logger.info('Selected "EP1009 - JYOTHI SUJESHKUMAR".');

            // 5. (Recommended) Assert that the selection is now displayed correctly.
            await expect(reportingDropdownContainer.getByText('EP1009 - JYOTHI SUJESHKUMAR')).toBeVisible();
        });
        await test.step('describing role description', async () => {
            logger.info('Describing role description ...');
            const roleDescriptionInput = page.locator('textarea[ng-model="CRUDModel.ViewModel.RoleSummary"]');;
            await roleDescriptionInput.waitFor({ state: 'visible' });
            await roleDescriptionInput.fill('Responsible for developing and maintaining software applications.');
            await expect(roleDescriptionInput).toHaveValue('Responsible for developing and maintaining software applications.');
        });
        await test.step('describing responsibilities', async () => {
            logger.info('Describing responsibilities ...');
            const responsibilitiesInput = page.locator('textarea[ng-model="CRUDModel.ViewModel.Responsibilities"]');;
            await responsibilitiesInput.waitFor({ state: 'visible' });
            await responsibilitiesInput.fill('1. Write clean code\n2. Collaborate with cross-functional teams\n3. Participate in code reviews.');
            await expect(responsibilitiesInput).toHaveValue('1. Write clean code\n2. Collaborate with cross-functional teams\n3. Participate in code reviews.');
        });
        await test.step('saving career description', async () => {
            logger.info('Saving career description ...');
            const saveButton = page.getByTitle('Save').first();
            await saveButton.waitFor({ state: 'visible', timeout: 10000 });
            await saveButton.click();
            logger.info('Save button clicked.');
        });
    });
});