import { Page, expect } from '@playwright/test';
import logger from '../utils/logger';

export async function clickSaveButton(page: Page) {
  logger.info('Clicking Save button...');
  const saveButton = page.getByTitle('Save').first();
  await expect(saveButton).toBeVisible({ timeout: 10000 });
  await saveButton.click();
  logger.info('Save button clicked successfully.');
}

export async function clickCreateButton(page: Page, title: string) {
  logger.info(`Clicking Create button with title="${title}"`);
  const createButton = page.getByTitle(title).first();
  await expect(createButton).toBeVisible({ timeout: 10000 });
  await createButton.click();
  logger.info(`${title} button clicked successfully.`);
}

export async function checkIsActiveCheckbox(page: Page) {
  logger.info('Checking Is Active checkbox...');
  const checkbox = page.locator('input[ng-model="CRUDModel.ViewModel.IsActive"]');
  await expect(checkbox).toBeVisible({ timeout: 10000 });

  await checkbox.evaluate((element: HTMLInputElement) => {
    element.checked = true;
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
  });

  await expect(checkbox).toBeChecked();
  logger.info('Is Active checkbox checked successfully.');
}

export async function navigateToMenu(page: Page, menuPath: string[]) {
  logger.info(`Navigating through menu path: ${menuPath.join(' → ')}`);

  // 1️⃣ Step 1 - Open search and type the top-level keyword (e.g. 'lesson')
  // The test flow expects the user to search the root node first, then drill down.
  const searchKeyword = menuPath[0]; // use first element so we search e.g. 'lesson'
  const searchBox = page.getByRole('textbox', { name: 'Search Menu' });
  await expect(searchBox).toBeVisible({ timeout: 15000 });
  await searchBox.click();
  await searchBox.fill(searchKeyword);
  await searchBox.press('Enter');

  // 2️⃣ Step 2 - Sequentially click through each menu level
  // Note: the first element of menuPath is treated as the search keyword only.
  // Subsequent elements are the actual nodes to click (e.g. ['lesson', 'Curriculum', 'Lesson Plans']).
  const targets = menuPath.slice(1);
  for (const menuName of targets) {
    const menuLocator = page.locator(`.tree-section:has-text("${menuName}")`).first();
    // Ensure the menu item is visible before clicking. If the search filtered items
    // it should be visible; otherwise this will timeout and give a clear error.
    await expect(menuLocator).toBeVisible({ timeout: 10000 });
    await menuLocator.click();
    logger.info(`Clicked on menu: ${menuName}`);
  }

  logger.info(`✅ Navigation successful: ${menuPath.join(' → ')}`);
}
