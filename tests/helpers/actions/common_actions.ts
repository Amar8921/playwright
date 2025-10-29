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

async function findMenuElement(page: Page, menuName: string, lastClickedMenu: string) {
  // Try different strategies to find the menu item
  const strategies = [
    // 1. Most specific - exact match with menu structure
    () => page.locator(`.tree-section span.fs-6.fw-medium.colorNavigation.menu-item-text:text("${menuName}")`),
    
    // 2. Look for menu item within expanded submenu
    () => page.locator(`.tree-content.active ~ * .menu-item-text:text("${menuName}")`),
    
    // 3. Look for any menu item text with exact match
    () => page.locator(`span.menu-item-text:text-is("${menuName}")`),
    
    // 4. Look for the text within any tree section (fallback)
    () => page.locator(`.tree-section:has-text("${menuName}")`).first(),
    
    // 5. Look for exact text match anywhere (last resort)
    () => page.getByText(menuName, { exact: true })
  ];

  // Try each strategy until we find a visible element
  for (const getLocator of strategies) {
    const locator = getLocator();
    const isVisible = await locator.isVisible().catch(() => false);
    if (isVisible) {
      return locator;
    }
  }

  // If no strategy worked, return the first strategy's locator
  // (it will fail with a clear error message)
  return strategies[0]();
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
  
  // Keep track of the current menu context to handle nested items
  let lastClickedMenu = '';
  
  for (const menuName of targets) {
    try {
      // Try multiple strategies to find the menu item
      const menuLocator = await findMenuElement(page, menuName, lastClickedMenu);
      
      // Wait for menu to be both present and visible
      await menuLocator.waitFor({ state: 'visible', timeout: 10000 });
      
      // Scroll the menu into view if needed
      await menuLocator.scrollIntoViewIfNeeded();
      
      // Click and wait a moment for any animations/child menus
      // Click and wait for any menu state changes
      await menuLocator.click();
      
      // Wait longer for the last item since it might need to load content
      const isLastItem = menuName === targets[targets.length - 1];
      await page.waitForTimeout(isLastItem ? 2000 : 500);
      
      // After clicking, wait for menu structure to update
      await page.waitForLoadState('domcontentloaded');
      
      lastClickedMenu = menuName;
      logger.info(`Clicked on menu: ${menuName}`);
    } catch (error) {
      logger.error(`Failed to click menu item "${menuName}". Last successful click: ${lastClickedMenu || 'none'}`);
      throw error;
    }
  }

  logger.info(`✅ Navigation successful: ${menuPath.join(' → ')}`);
}
