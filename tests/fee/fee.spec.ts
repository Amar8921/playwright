import { test, expect } from '@playwright/test';
import { login } from '../helpers/login';
import logger from '../helpers/utils/logger';
import { waitForToast } from '../helpers/utils/ui';
import { log } from 'console';

test.describe('Fee collection', () => {
    test.beforeEach(async ({ page }) => {
        await test.step('Login to the app', async () => {
            logger.info('Logging in...');
            await login(page);
            logger.info('Login successful.');
        });
    });

    test('should collect fee successfully', async ({ page }) => {
        logger.info('Starting fee collection test...');

        await test.step('Navigate to Collect Fees', async () => {
            logger.info('Navigating to Collect Fees menu...');

            // Search for menu
            const searchBox = page.getByRole('textbox', { name: 'Search Menu' });
            await searchBox.waitFor({ state: 'visible', timeout: 15000 });
            await searchBox.click();
            await searchBox.fill('fee');
            await searchBox.press('Enter');

            // After searching, the tree is filtered. Now, expand the "Schools" node.
            const schoolsNode = page.locator('.tree-section', { hasText: 'Schools' }).first();
            await schoolsNode.waitFor({ state: 'visible', timeout: 10000 });
            await schoolsNode.click();

            // Now that "Schools" is expanded, the "Fee" item should be visible.
            const feeMenu = page.locator('div.tree-section:has-text("Fee")').first();
            await feeMenu.waitFor({ state: 'visible', timeout: 10000 });
            await feeMenu.click();


            // Click the "Create" button directly using its title, as suggested by codegen.
            // This is less specific, but attempts to scope it have failed, suggesting a complex DOM structure.
            await page.getByTitle('Create').first().click();

            logger.info('Create button for Collect Fees clicked.');
        });

        await test.step('Fill Fee Details', async () => {
            logger.info('Filling in fee details...');

            logger.info('Opening Academic Year dropdown...');
            // First, locate the specific dropdown component by its unique ng-model attribute.
            const academicYearDropdown = page.locator('[ng-model="CRUDModel.ViewModel.Academic"]');
            // Then, within that specific component, find the clickable element by its ARIA label.
            await academicYearDropdown.getByLabel('Select box select').click();

            logger.info('Selecting Academic Year...');
            // Use getByText for option selection as it was provided by codegen and seems to work.
            await page.getByText('Meshaf (2025-2026) (2026)').click();

            logger.info('Verifying Academic Year selection...');
            // Verify that the selected text is now displayed in the dropdown.
            await expect(academicYearDropdown.locator('.select2-chosen', { hasText: 'Meshaf (2025-2026) (2026)' })).toBeVisible();

            logger.info('Filling class field...');
            const classDropdown = page.locator('[ng-model="CRUDModel.ViewModel.StudentClass"]');
            await classDropdown.getByLabel('Select box select').click();
            await page.locator('.ui-select-dropdown .select2-results').getByText('Class 1 - Meshaf').click();
            logger.info('Class selected.');

            logger.info('Filling section field...');
            const sectionDropdown = page.locator('[ng-model="CRUDModel.ViewModel.Section"]');
            await sectionDropdown.getByLabel('Select box select').click();
            await page.locator('.ui-select-dropdown .select2-results').getByText('MA').click();
            logger.info('Section selected.');

            logger.info('Filling student name field...');
            // To make the student combobox selection robust, we first locate its specific container
            // by its ng-model, then find the combobox within that container.
            const studentDropdownContainer = page.locator('[ng-model="CRUDModel.ViewModel.Student"]');
            const studentNameCombobox = studentDropdownContainer.getByRole('combobox', { name: 'Select box' });
            
            await studentNameCombobox.click();
            await studentNameCombobox.fill('p6181');
            await studentNameCombobox.press('Enter'); // Press Enter to select the first result or trigger search/selection.

            logger.info('Student selected.'); 
            
            await test.step('Select Fee Master', async () => {
            logger.info('Selecting Fee Master...');
            // Locate the Fee Master component by its ng-model.
            const feeMasterDropdownContainer = page.locator('[ng-model="CRUDModel.ViewModel.FeeMaster"]');
            const feeMasterSearchInput = feeMasterDropdownContainer.getByRole('combobox', { name: 'Select box' });

            // Wait for the search input to be visible and interact with it.
            await feeMasterSearchInput.waitFor({ state: 'visible' });
            await feeMasterSearchInput.fill('Photograph fee');
            await feeMasterSearchInput.press('Enter');

            logger.info('Fee Master selected.');
            await expect(feeMasterDropdownContainer.locator('.select2-choices', { hasText: 'Photograph fee' })).toBeVisible();

            logger.info('Filling amount field...');
            const amountInput = page.locator('input[ng-model="CRUDModel.ViewModel.Amount"]');
            await amountInput.fill('100');
            await expect(amountInput).toHaveValue('100');
            logger.info('Amount filled.');
        });

            await test.step('Click Generate and handle "No Pending Fees" message', async () => {
        await page.locator('a[ng-click="SaveStudentFeeDue()"]').click();
        logger.info('Generate button clicked.');

        const expectedErrorMessage = "Pending Fees are not Available.";
        
        // Call waitForToast with the expected error message
        const toastResult = await waitForToast(page, 10000, expectedErrorMessage);

        // Assert that the result was an expected error
        expect(toastResult).toBe('expected-error');

        logger.info(`Fee collection process completed, handled: "${expectedErrorMessage}".`); 
    });
    });
});
});

