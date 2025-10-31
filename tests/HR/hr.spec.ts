import { test, expect } from '@playwright/test';
import { login } from '../helpers/login';
import logger from '../helpers/utils/logger';
import { waitForToast } from '../helpers/utils/ui';
import { navigateToEmployeeMenu } from '../helpers/navigation/hr_navigation';
import { log } from 'console';
import { clickCreateButton, clickViewReportButton, navigateToMenu, verifyReportVisible } from '../helpers/actions/common_actions';

test.describe('HR testing', () => {
    test.beforeEach(async ({ page }) => {
        await test.step('Login to the app', async () => {
            logger.info('Logging in...');
            await login(page);
            logger.info('Login successful.');
        });
    });

    test('should check hr employee editing', async ({ page }) => {
        await test.step('Navigate to Employee menu', async () => {
            logger.info('Navigating to Employee menu...');
            await navigateToMenu(page, ['employee', 'HR', 'Employee']);
            logger.info('Navigation successful.');
        } );

        await test.step('clicking edit button', async () => {
            logger.info('Clicking the Edit button...');
            const editButton = page.locator('span.editcolor[ng-click*="EditViewCRUDFramework(\'Employee\',"]').first();
            await editButton.waitFor({ state: 'visible', timeout: 10000 });
            await editButton.click();
        });

        await test.step('clicking save button', async () => {
            logger.info('Clicking the Save button...');
            const saveButton = page.getByTitle('Save').first();
            await saveButton.waitFor({ state: 'visible', timeout: 10000 });
            await saveButton.click();
        });

        await test.step('waiting for success toast', async () => {
            logger.info('Waiting for success toast...');
            await waitForToast(page);
            logger.info('HR employee editing test completed successfully.');
        });
    });

    test('create new employee', async ({ page }) => {
        logger.info('Starting HR create new employee test...');

        await test.step('Navigate to Student Attendance menu', async () => {
            logger.info('Navigating to Student Attendance menu...');
            await navigateToMenu(page, ['employee', 'HR', 'Employee']);
            logger.info('Navigation successful.');
        });

        await test.step('Click Create button', async () => {
            await clickCreateButton(page, 'Create Employee');
            logger.info('Create Employee button clicked successfully.');
        });
        await test.step('filling employee first name and last', async () => {
            logger.info('Filling in Employee Name...');
            const employeeFirstNameInput = page.locator('input[ng-model="CRUDModel.ViewModel.FirstName"]');;
            await employeeFirstNameInput.waitFor({ state: 'visible', timeout: 10000 });
            await employeeFirstNameInput.fill('John');

            const employeeLastNameInput = page.locator('input[ng-model="CRUDModel.ViewModel.LastName"]');;
            await employeeLastNameInput.waitFor({ state: 'visible', timeout: 10000 });
            await employeeLastNameInput.fill('Smith');
        });
        await test.step('selecting gender', async () => {
            logger.info('Selecting Gender...');
            const genderDropdown = page.locator('select[ng-model="CRUDModel.ViewModel.Gender"]');
            await genderDropdown.waitFor({ state: 'visible', timeout: 10000 });
            await genderDropdown.selectOption({ value: '1' });
            await expect(genderDropdown).toHaveValue('1');
        });
        await test.step('selecting job type', async () => {
            logger.info('Selecting Job Type...');
            const jobTypeDropdown = page.locator('select[ng-model="CRUDModel.ViewModel.JobType"]');
            await jobTypeDropdown.waitFor({ state: 'visible', timeout: 10000 });
            await jobTypeDropdown.selectOption({ value: '1' });
            await expect(jobTypeDropdown).toHaveValue('1');
        });
        await test.step('clicking status active', async () => {
            logger.info('Setting Status to Active...');
            const statusCheckbox = page.locator('select[ng-model="CRUDModel.ViewModel.Status"]');
            await statusCheckbox.waitFor({ state: 'visible', timeout: 10000 });
            await statusCheckbox.selectOption({ value: '1' });
            await expect(statusCheckbox).toHaveValue('1');
        });
        await test.step('inputing dob', async () => {
            logger.info('Inputting Date of Birth...');
            const dobInput = page.locator('input[ng-model="CRUDModel.ViewModel.BirthDateString"]');
            await dobInput.waitFor({ state: 'visible', timeout: 10000 });
            await dobInput.fill('30/03/2001');
        });
        await test.step('enetring emergency contact number', async () => {
            logger.info('Entering Emergency Contact Number...');
            const emergencyContactInput = page.locator('input[ng-model="CRUDModel.ViewModel.EmergencyContactNo"]');
            await emergencyContactInput.waitFor({ state: 'visible', timeout: 10000 });
            await emergencyContactInput.fill('1234567890');
        });
        await test.step('selecting nationality', async () => {  
            logger.info('Selecting Nationality...');

            // Step 1: Locate the main dropdown container and click its visible part to open the list.
            // The `<a>` tag inside the main div is the element that receives the click.
            const nationalityDropdownContainer = page.locator('[ng-model="CRUDModel.ViewModel.Nationality"]');
            await nationalityDropdownContainer.locator('a.select2-choice').click();
            logger.info('Nationality dropdown opened.');

            // Step 2: Locate the specific option from the list that appears and click it.
            // The options are `li` elements with role="option". Using getByRole is very robust.
            await page.getByRole('option', { name: 'Indian' }).click();
            logger.info('Selected "Indian" from the list.');

        });
        await test.step('inputing mobile number', async () => {  
            logger.info('Inputting Mobile Number...');
            const mobileInput = page.locator('input[ng-model="CRUDModel.ViewModel.WorkMobileNo"]');
            await mobileInput.waitFor({ state: 'visible', timeout: 10000 });
            await mobileInput.fill('9876543210');
        });
        await test.step('Selecting role', async () => {  
            logger.info('Selecting Role...');

            const roleDropdownContainer = page.locator('[ng-model="CRUDModel.ViewModel.EmployeeRoles"]');
            await roleDropdownContainer.locator('input.select2-input').click();
            logger.info('Role dropdown activated.');

            // --- THIS IS THE FIX ---
            // First, locate the container for the dropdown options that just appeared.
            // Then, find the specific option *inside* that container.
            const dropdownOptionsContainer = page.locator('div.ui-select-dropdown');
            await dropdownOptionsContainer.getByRole('option', { name: 'Accountant' }).click();
            // ----------------------

            logger.info('Role "Accountant" selected.');

            // Close the dropdown and verify
            await roleDropdownContainer.click();
            await expect(roleDropdownContainer.getByText('Accountant')).toBeVisible();
        });
        await test.step('selecting branch', async () => {
            logger.info('Selecting Branch...');

            // Locate the dropdown
            const branchDropdown = page.locator('select[ng-model="CRUDModel.ViewModel.Branch"]');

            // Wait until it becomes visible
            await branchDropdown.waitFor({ state: 'visible', timeout: 15000 });

            // Wait until the dropdown has loaded its options (Angular can delay this

            // Select the desired branch by label
            await branchDropdown.selectOption({ label: 'Stores Madinatna' });

            // Verify that the dropdown now holds the expected value
            await expect(branchDropdown).toHaveValue('10003');

            logger.info('Branch selected successfully: Stores Madinatna');
            });

        await test.step('inputing date of joining', async () => {
            logger.info('Inputting Date of Joining...');
            const dojInput = page.locator('input[ng-model="CRUDModel.ViewModel.JoiningDateString"]');
            await dojInput.waitFor({ state: 'visible', timeout: 10000 });
            await dojInput.fill('01/01/2024');
            logger.info('Date of Joining inputted.');
        });
        await test.step('selecting department', async () => {
            logger.info('Selecting Department...');
            const departmentDropdown = page.locator('select[ng-model="CRUDModel.ViewModel.Department"]');
            await departmentDropdown.waitFor({ state: 'visible', timeout: 10000 });
            await departmentDropdown.selectOption({ value: '1' });
            await expect(departmentDropdown).toHaveValue('1');
            logger.info('Department selected.');
        });
    });

    test('create employee promotion', async ({ page }) => {
        logger.info('Starting HR create employee promotion test...');
        await test.step('Navigate to Employee Promotion menu', async () => {
            logger.info('Navigating to Employee Promotion menu...');
            await navigateToMenu(page, ['employee', 'HR', 'Employee Promotion']);
            logger.info('Navigation successful.');
        });
        await test.step('Click Create button', async () => {
            await clickCreateButton(page, 'Create Employee Promotion');
            logger.info('Create Employee Promotion button clicked successfully.');
        });

        await test.step('selecting employee', async () => {
            logger.info('Selecting Class...');
            const employeeDropdown = page.locator('[ng-model="CRUDModel.ViewModel.Employee"]');
            await employeeDropdown.getByLabel('Select box select').click();

            const employeeOption = page.locator('.ui-select-choices-row-inner', { hasText: 'EP1228 - ATHULSANKAR' }).first();
            await employeeOption.click();
            logger.info('Verifying employee selection...');
            await expect(employeeDropdown.locator('.select2-chosen', { hasText: 'EP1228 - ATHULSANKAR' })).toBeVisible();
            
        }); 

        await test.step('input from date', async () => {
            logger.info('Inputting From Date...');
            const fromDateInput = page.locator('input[ng-model="CRUDModel.ViewModel.FromdateString"]');
            await fromDateInput.waitFor({ state: 'visible', timeout: 10000 });
            await fromDateInput.fill('01/05/2024');
            logger.info('From Date inputted.');
        });

        await test.step('clicking save button', async () => {
            logger.info('Clicking the Save button...');
            await clickCreateButton(page, 'Save');
            logger.info('Save button clicked successfully.');
        });


    });

    test('Employee ID Card Generation', async ({ page }) => {
        logger.info('Starting Employee ID Card Generation test...');
        await test.step('Navigate to Employee ID Card Generation menu', async () => {
            logger.info('Navigating to Employee ID Card Generation menu...');
            await navigateToMenu(page, ['employee', 'Reports','HR Reports', 'Employee ID Card']);
            logger.info('Navigation successful.');
        });

        await test.step('select designation', async () => {
            logger.info('Selecting Designation...');
            const designationDropdown = page.locator('[ng-model="ParameterModel.Designation"]');
            await designationDropdown.getByLabel('Select box select').click();
            const designationOption = page.locator('.ui-select-choices-row-inner', { hasText: 'Accountant' }).first();
            await designationOption.click();
            logger.info('Verifying designation selection...');
            await expect(designationDropdown.locator('.select2-chosen', { hasText: 'Accountant' })).toBeVisible();
        });

        await test.step('selecting employee', async () => {
            logger.info('Selecting Employee...');
            const employeeDropdown = page.locator('[ng-model="ParameterModel.Employee_IDs"]');
            await employeeDropdown.getByLabel('Select box select').click();
            const employeeOption = page.locator('.ui-select-choices-row-inner', { hasText: 'All' }).first();
            await employeeOption.click();
            logger.info('Verifying employee selection...');
            await expect(employeeDropdown.locator('.select2-chosen', { hasText: 'All' })).toBeVisible();
        });

        await test.step('Clicking View Report button', async () => {
            await clickViewReportButton(page);
            });

        //how can i veryfy the report is generated and how can i confirm the id card is visible

        await test.step('Verify report is visible', async () => {
            await verifyReportVisible(page);
            });

        
    });
});



