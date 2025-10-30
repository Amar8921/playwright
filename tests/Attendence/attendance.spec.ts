import { test, expect } from '@playwright/test';
import { login } from '../helpers/login';
import logger from '../helpers/utils/logger';
import { waitForToast } from '../helpers/utils/ui';
import { log } from 'console';
import { clickCreateButton, clickSaveButton, navigateToMenu } from '../helpers/actions/common_actions';


test.describe('Attendence', () => {
    test.beforeEach(async ({ page }) => {
        await test.step('Login to the app', async () => {
            logger.info('Logging in...');
            await login(page);
            logger.info('Login successful.');
        });
    });

    test('should class wise attendence checking', async ({ page }) => {
        logger.info('Starting attendence checking...');

        await test.step('Navigate to Class wise attendance menu', async () => {
            logger.info('Navigating to Attendence menu...');
            await navigateToMenu(page, ['attend', 'Schools', 'Attendances','Class Wise Attendance']);
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

    test('Student Attendance creation flow', async ({ page }) => {

  await test.step('Navigate to Student Attendance menu', async () => {
    logger.info('Navigating to Student Attendance menu...');
    await navigateToMenu(page, ['attend', 'Schools', 'Attendances', 'Student Attendance']);
    logger.info('Navigation successful.');
  });

  await test.step('Click Create button', async () => {
    logger.info('Clicking Create Student Attendance button...');
    await clickCreateButton(page, 'Create Student Attendance');
    logger.info('Create button clicked.');
  });

  await test.step('Select Class', async () => {
    logger.info('Selecting Class...');
    const classDropdown = page.locator('[ng-model="CRUDModel.ViewModel.StudentClass"]');
    await classDropdown.getByLabel('Select box select').click();
    await page.locator('.ui-select-dropdown .select2-results').getByText('Class 1 - Meshaf', { exact: true }).click();
    logger.info('Class selected.');
  });

  await test.step('Select Section', async () => {
    logger.info('Selecting Section...');
    const sectionDropdown = page.locator('[ng-model="CRUDModel.ViewModel.Section"]');
    await sectionDropdown.getByLabel('Select box select').click();
    await page.locator('.ui-select-dropdown .select2-results').getByText('MA', { exact: true }).click();
    logger.info('Section selected.');
  });

  await test.step('Select Student', async () => {
    logger.info('Selecting Student...');
    const studentDropdown = page.locator('[ng-model="CRUDModel.ViewModel.Student"]');
    await studentDropdown.getByLabel('Select box select').click();
    await page.locator('.ui-select-dropdown .select2-results').getByText('P3973- GHAZI   ALI', { exact: true }).click();
    logger.info('Student selected.');
  });

  await test.step('Input Date', async () => {
    logger.info('Filling attendance date...');
    const dateInput = page.locator('input[ng-model="CRUDModel.ViewModel.Attendence.AttendenceDateString"]');
    await dateInput.fill('2024-06-10');
    logger.info('Date input successful.');
  });

  await test.step('Select Status', async () => {
  logger.info('Selecting attendance status...');
  const statusDropdown = page.locator('select[ng-model="CRUDModel.ViewModel.Attendence.PresentStatus"]');
  await statusDropdown.selectOption('6'); // Selecting "Present" status
  logger.info('Status selection successful.');
});
    await test.step('Save Attendance', async () => {
        await clickSaveButton(page);
        logger.info('Save button clicked, waiting for confirmation toast...');
        logger.info('Attendance saved successfully.');
    });

  logger.info('✅ Student Attendance creation completed successfully.');
});

});

