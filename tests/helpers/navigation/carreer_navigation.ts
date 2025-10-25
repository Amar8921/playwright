
import {test, Page } from '@playwright/test';
import logger from '../utils/logger'; 

export async function navigateToCareerMenu(page: Page) {
    await test.step('Navigate to Career Menu', async () => {
        logger.info('Navigating to Career menu...');

        const searchBox = page.getByRole('textbox', { name: 'Search Menu' });
        await searchBox.waitFor({ state: 'visible', timeout: 15000 });
        await searchBox.click();
        await searchBox.fill('careers');
        await searchBox.press('Enter');

        logger.info('Selecting Careers node...');
        const careersNode = page.locator('.tree-section', { hasText: 'Careers' }).first();
        await careersNode.waitFor({ state: 'visible', timeout: 10000 });
        await careersNode.click();
        logger.info('clicked Careers node');
    });
}
