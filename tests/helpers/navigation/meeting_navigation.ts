
import {test, Page } from '@playwright/test';
import logger from '../utils/logger'; 

export async function navigateToMeetingMenu(page: Page) {
    await test.step('Navigate to Meeting Menu', async () => {
        logger.info('Navigating to Meeting menu...');

        const searchBox = page.getByRole('textbox', { name: 'Search Menu' });
        await searchBox.waitFor({ state: 'visible', timeout: 15000 });
        await searchBox.click();
        await searchBox.fill('meeting');
        await searchBox.press('Enter');
        logger.info('Selecting Meeting node...');
        const meetingNode = page.locator('.tree-section', { hasText: 'Meeting' }).first();
        await meetingNode.waitFor({ state: 'visible', timeout: 10000 });
        await meetingNode.click();
        logger.info('clicked Meeting node');
    });
}