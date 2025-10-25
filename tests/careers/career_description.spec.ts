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

    test('career listing', async ({ page }) => {
        logger.info('navigating career listing  ...');

        await navigateToCareerMenu(page);
        logger.info('clicking career listing  ...');

        const careerListing = page.locator('div.tree-section:has-text("Career Listing")').first();
        await careerListing.waitFor({ state: 'visible', timeout: 10000 });
        await careerListing.click();

        logger.info('career listing clicked  ...');

        logger.info('clicking create button', async () => {
            logger.info('Clicking the Create button...');
            const createButton = page.getByTitle('Create').first();
            await createButton.waitFor({ state: 'visible', timeout: 10000 });
            await createButton.click();
        });

        logger.info('selecting type of job dropdown', async () => {
            logger.info('Selecting type of job dropdown ...');
            const typeOfJobDropdown = page.locator('select[ng-model="CRUDModel.ViewModel.TypeOfJob"]');;
            await typeOfJobDropdown.waitFor({ state: 'visible', timeout: 10000 });
            await typeOfJobDropdown.selectOption({ value: '1' });
            await expect(typeOfJobDropdown).toHaveValue('1');
        });

        logger.info('filling job title', async () => {
            logger.info('Filling job title ...');
            const jobTitleInput = page.locator('input[ng-model="CRUDModel.ViewModel.JobTitle"]');;
            await jobTitleInput.waitFor({ state: 'visible' });
            await jobTitleInput.fill('Junior Developer');
            await expect(jobTitleInput).toHaveValue('Junior Developer');
        });

        logger.info('selecting designation', async () => {
            logger.info('Selecting designation ...');
            const designationDropdown = page.locator('select[ng-model="CRUDModel.ViewModel.JobTitle"]');;
            await designationDropdown.waitFor({ state: 'visible', timeout: 10000 });
            await designationDropdown.selectOption({ value: '1' });
            await expect(designationDropdown).toHaveValue('1');
        });

        logger.info('selecting department', async () => {
            logger.info('Selecting department ...');
            const departmentDropdown = page.locator('select[ng-model="CRUDModel.ViewModel.Department"]');;
            await departmentDropdown.waitFor({ state: 'visible', timeout: 10000 });
            await departmentDropdown.selectOption({ value: '1' });
            await expect(departmentDropdown).toHaveValue('1');
        });

        logger.info('inputing job description', async () => {
            logger.info('Inputing job description ...');
            const jobDescriptionInput = page.locator('textarea[ng-model="CRUDModel.ViewModel.JobDescription"]');;
            await jobDescriptionInput.waitFor({ state: 'visible' });
            await jobDescriptionInput.fill('This is a job description for Junior Developer position.');
            await expect(jobDescriptionInput).toHaveValue('This is a job description for Junior Developer position.');
        });

        logger.info('inputing job details', async () => {
            logger.info('Inputing job details ...');
            const jobDetailsInput = page.locator('textarea[ng-model="CRUDModel.ViewModel.JobDetail"]');;
            await jobDetailsInput.waitFor({ state: 'visible' });
            await jobDetailsInput.fill('Detailed information about the Junior Developer role and responsibilities.');
            await expect(jobDetailsInput).toHaveValue('Detailed information about the Junior Developer role and responsibilities.');
        });

        logger.info('inputing publish date', async () => {
            logger.info('Inputing publish date ...');
            const publishDateInput = page.locator('input[ng-model="CRUDModel.ViewModel.PublishDateString"]');;
            await publishDateInput.waitFor({ state: 'visible' });
            await publishDateInput.fill('06/15/2024');
            await expect(publishDateInput).toHaveValue('06/15/2024');
        });

        logger.info('selecting status', async () => {
            logger.info('Selecting status ...');
            const statusDropdown = page.locator('select[ng-model="CRUDModel.ViewModel.JobStatus" ]');;
            await statusDropdown.waitFor({ state: 'visible', timeout: 10000 });
            await statusDropdown.selectOption({ value: '1' });
            await expect(statusDropdown).toHaveValue('1');
        });
});
});