
import {test, Page } from '@playwright/test';
import logger from '../utils/logger'; // Adjust path to your logger if needed

/**
 * Navigates from the dashboard to the main Employee grid screen in the HR module.
 * @param page The Playwright Page object.
 */
export async function navigateToEmployeeMenu(page: Page) {
    await test.step('Navigate to HR Employee Menu', async () => {
        logger.info('Navigating to HR Employee menu...');
        
        // Search for the menu
        const searchBox = page.getByRole('textbox', { name: 'Search Menu' });
        await searchBox.waitFor({ state: 'visible', timeout: 15000 });
        await searchBox.click();
        await searchBox.fill('hr');
        await searchBox.press('Enter');

        // Select HR & Payroll node
        logger.info('Selecting HR and Payroll...');
        const schoolsNode = page.locator('.tree-section', { hasText: 'HR & Payroll' }).first();
        await schoolsNode.waitFor({ state: 'visible', timeout: 10000 });
        await schoolsNode.click();
        
        logger.info('Selected Employee menu...');
        
    });
}