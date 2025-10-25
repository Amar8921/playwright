import { test, expect } from '@playwright/test';
import { login } from '../helpers/login';
import logger from '../helpers/utils/logger';
import { waitForToast } from '../helpers/utils/ui';
import { navigateToMeetingMenu } from '../helpers/navigation/meeting_navigation';
import { log } from 'console';

test.describe('Meeting testing', () => {
    test.beforeEach(async ({ page }) => {
        await test.step('Login to the app', async () => {
            logger.info('Logging in...');
            await login(page);
            logger.info('Login successful.');
        });
    });

    test('should check hr employee editing', async ({ page }) => {
        logger.info('Starting HR employee editing test...');

        // === REFACTORED PART ===
        // Call the single navigation function
        await navigateToMeetingMenu(page);

        const feeMenu = page.locator('div.tree-section:has-text("Meeting")').first();
            await feeMenu.waitFor({ state: 'visible', timeout: 10000 });
            await feeMenu.click();
            logger.info('clicked Meeting menu');

        await test.step('clicking create button', async () => {
            logger.info('Clicking the Create button...');
            const createButton = page.getByTitle('Create').first();
            await createButton.waitFor({ state: 'visible', timeout: 10000 });
            await createButton.click();
        });
    });

});

