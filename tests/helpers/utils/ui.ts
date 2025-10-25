// helpers/utils/ui.ts

import { Page } from '@playwright/test';
import logger from './logger';

/**
 * Waits for a success or error toast message to appear by manually polling.
 * This is a robust way to handle tricky, framework-dependent timing issues.
 * @param page - The Playwright Page object.
 * @param timeout - The maximum time to wait for the toast in milliseconds. Defaults to 10000.
 * @param expectedErrorMessage - Optional: If provided, and an error toast with this exact message appears,
 *                                the function will return 'expected-error' instead of throwing an error.
 * @returns 'success' if a success message appears, 'error' if an unexpected error message appears,
 *          or 'expected-error' if a specific expectedErrorMessage is found.
 * @throws An error if an unexpected error message appears or if no message appears within the timeout.
 */
export async function waitForToast(
    page: Page,
    timeout: number = 10000,
    expectedErrorMessage?: string
): Promise<'success' | 'error' | 'expected-error'> { // Updated return type

    const successLocator = page.locator('.msg-alert .success-msg, .msg-alert .success-msginner').first();
    const errorLocator = page.locator('.msg-alert .error-msg, .msg-alert .error-msginner, .msg-alert .alert-danger, .msg-alert .toast-error').first();

    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
        if (await successLocator.isVisible()) {
            const text = await successLocator.innerText();
            logger.info(`✅ Operation successful: ${text.trim()}`);
            return 'success';
        }
        if (await errorLocator.isVisible()) {
            const text = await errorLocator.innerText();
            logger.error(`❌ Operation failed: ${text.trim()}`);

            // --- NEW LOGIC HERE ---
            if (expectedErrorMessage && text.trim().includes(expectedErrorMessage)) {
                logger.info(`☑️ Handled expected error: "${text.trim()}"`);
                return 'expected-error'; // Return a specific string for expected error
            } else {
                // It's an error, and it's either not expected or doesn't match the expected message
                throw new Error(`Operation failed with message: ${text.trim()}`);
            }
        }
        // Wait for a short interval before checking again
        await page.waitForTimeout(100);
    }

    throw new Error(`⚠️ No status message appeared after ${timeout / 1000} seconds.`);
}