import { test, expect } from '@playwright/test';
import { login } from '../helpers/login';
import logger from '../helpers/utils/logger';
import { waitForToast } from '../helpers/utils/ui';

test.describe('Lead Creation', () => {
  test.beforeEach(async ({ page }) => {
    await test.step('Login to the app', async () => {
      logger.info('Logging in...');
      await login(page);
      logger.info('Login successful.');
    });
  });

  test('should create a new lead', async ({ page }) => {
    logger.info('Starting lead creation test...');

    await test.step('Navigate to lead creation page via search menu', async () => {
      logger.info('Navigating to lead creation...');
      const searchBox = page.getByRole('textbox', { name: 'Search Menu' });
      await searchBox.click();
      await searchBox.fill('lead');
      await searchBox.press('Enter');

      // Wait for tree to render
      await page.waitForSelector('.tree-section', { state: 'visible' });
      await page.locator('.tree-section').first().click();
      await page
        .locator('.tree-sub > div > .tree-node.ng-scope.has-submenu > div')
        .first()
        .click();
      await page
        .locator(
          '.tree-sub > div > .tree-node.ng-scope.has-submenu > .tree-sub > div > .tree-node > .tree-content > .tree-section'
        )
        .first()
        .click();

      await page.getByTitle('Create Lead').click();
      logger.info('On the lead creation page.');
    });

    await test.step('Fill Lead Name', async () => {
      const leadNameInput = page.locator('input[ng-model="CRUDModel.ViewModel.LeadName"]');
      await leadNameInput.waitFor({ state: 'visible' });
      logger.info('Filling in lead name...');
      await leadNameInput.fill('Amar1');
      await expect(leadNameInput).toHaveValue('Amar1');
    });

    await test.step('Select School', async () => {
      const schoolSelect = page.locator('select[ng-model="CRUDModel.ViewModel.School"]');
      await schoolSelect.waitFor({ state: 'visible' });
      logger.info('Selecting school...');
      await schoolSelect.selectOption({ value: '30' });
      await expect(schoolSelect).toHaveValue('30');
    });

    await test.step('Select Lead Source', async () => {
      const leadSource = page.locator('select[ng-model="CRUDModel.ViewModel.LeadSource"]');
      await leadSource.waitFor({ state: 'visible' });
      await leadSource.selectOption({ value: '1' });
      await expect(leadSource).toHaveValue('1');
    });

    await test.step('Select Lead Type', async () => {
      const leadType = page.locator('select[ng-model="CRUDModel.ViewModel.LeadType"]');
      await leadType.waitFor({ state: 'visible' });
      await leadType.selectOption({ value: '1' });
      await expect(leadType).toHaveValue('1');
    });

    await test.step('Select Lead Status', async () => {
      const leadStatus = page.locator('select[ng-model="CRUDModel.ViewModel.LeadStatus"]');
      await leadStatus.waitFor({ state: 'visible' });
      await leadStatus.selectOption({ value: '1' });
      await expect(leadStatus).toHaveValue('1');
    });

    await test.step('Fill Contact / Student Details', async () => {
      const inputStudentName = page.locator('input[ng-model="CRUDModel.ViewModel.ContactDetails.StudentName"]');
      await inputStudentName.waitFor({ state: 'visible' });
      await inputStudentName.fill('Amarnath123');

      const genderSelect = page.locator('select[ng-model="CRUDModel.ViewModel.ContactDetails.Gender"]');
      await genderSelect.waitFor({ state: 'visible' });
      await genderSelect.selectOption({ value: '1' });

      const dobInput = page.locator('input[ng-model="CRUDModel.ViewModel.ContactDetails.DateOfBirthString"]');
      await dobInput.waitFor({ state: 'visible' });
      await dobInput.fill('01/01/2018');
    });

    await test.step('Select Academic Year', async () => {
      const academicYear = page.locator('select[ng-model="CRUDModel.ViewModel.ContactDetails.AcademicYear"]');
      await academicYear.waitFor({ state: 'visible' });
      await academicYear.selectOption({ value: '31' });
      await expect(academicYear).toHaveValue('31');
      logger.info('Academic Year selected successfully.');
    });

    await test.step('Select Curriculum and Class', async () => {
      const curriculumSelect = page.locator('select[ng-model="CRUDModel.ViewModel.ContactDetails.CurriculamString"]');
      await curriculumSelect.waitFor({ state: 'visible' });
      await curriculumSelect.selectOption({ value: '1' });

      const classSelect = page.locator('select[ng-model="CRUDModel.ViewModel.ContactDetails.ClassName"]');
      await classSelect.waitFor({ state: 'visible' });
      await classSelect.selectOption({ value: '1' });
    });

    await test.step('Fill Parent Contact Info', async () => {
      const inputFatherName = page.locator('input[ng-model="CRUDModel.ViewModel.ContactDetails.ParentName"]');
      await inputFatherName.waitFor({ state: 'visible' });
      await inputFatherName.fill('Ramesh Nath');

      const inputMobile = page.locator('input[ng-model="CRUDModel.ViewModel.ContactDetails.MobileNumber"]');
      await inputMobile.fill('9876543210');

      const inputEmail = page.locator('input[ng-model="CRUDModel.ViewModel.ContactDetails.EmailAddress"]');
      await inputEmail.fill('amar@gmail.com');
    });

    await test.step('Click Save and wait for toast', async () => {
      await page.getByRole('link', { name: ' Save', exact: true }).click();
      logger.info('Save button clicked.');

      await waitForToast(page);
      logger.info('Lead creation test completed successfully.');
    });

    });
  });
