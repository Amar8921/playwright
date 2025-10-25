import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://192.168.29.100:961/Account/Login?ReturnUrl=%2F');
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('superadmin@eduegate.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('123456');
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.getByRole('button', { name: 'Select' }).click();
  await page.locator('div').filter({ hasText: /^Dashboard$/ }).nth(2).click();
  console.log('Dashboard clicked');
});