import { test, expect } from '@playwright/test';
import { login } from '../helpers/login';
import logger from '../helpers/utils/logger';

test.describe('Academics - Timetable', () => {
  test('should navigate to timetable generation and select schedule type', async ({ page }) => {
    logger.info('Starting timetable test...');

    // Login to the application
    await login(page);
    logger.info('Login successful.');

    // Navigate to timetable generation
    logger.info('Navigating to timetable generation...');
    await page.getByRole('textbox', { name: 'Search Menu' }).click();
    await page.getByRole('textbox', { name: 'Search Menu' }).fill('time');
    await page.getByRole('textbox', { name: 'Search Menu' }).press('Enter');
    
    // Click on the search result
    await page.locator('.tree-content').first().click();
    await page.getByText('Time Table', { exact: true }).click();
    await page.getByText('Time Tables').click();
    logger.info('Navigated to Time Tables page.');

    // Open the creation dialog
    await page.getByTitle('Create Time Table Allocation').click();
    await expect(page.getByRole('link', { name: 'Smart scheduler' })).toBeVisible();
    logger.info('Create Time Table Allocation dialog is open.');

    // Navigate to smart scheduler and select type
    await page.getByRole('link', { name: 'Smart scheduler' }).click();
    
    const scheduleSelector = page.locator('#TimeTableAllacate_timetablesubjects_Tab_03 #timeTableType');
    await expect(scheduleSelector).toBeVisible();
    logger.info('Navigated to Smart Scheduler.');
    
    await scheduleSelector.selectOption('10');
    const selectedValue = await scheduleSelector.inputValue();
    expect(selectedValue).toBe('10');
    logger.info('Selected schedule type "10".');
    
    logger.info('Timetable test completed successfully.');
  });
});
