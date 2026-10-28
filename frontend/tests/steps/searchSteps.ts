import { Given, When, Then, Before, After } from '@cucumber/cucumber';
import { chromium, ChromiumBrowser, Page } from 'playwright';
import { expect } from '@playwright/test';

let browser: ChromiumBrowser;
let page: Page;

Before(async () => {
  browser = await chromium.launch({ headless: true });
  page = await browser.newPage();
});

After(async () => {
  await browser.close();
});

Given('the user opens the Semantic Dashboard interface', async () => {
  await page.goto('http://localhost:5173'); 
});

When('the user inputs {string} into the search box', async function (this: any, searchText: string) {
  const searchInput = page.locator('input[placeholder="Ask something semantically..."]');
  await searchInput.fill(searchText);
});

When('clicks the "Send" submission button', async () => {
  // Use Playwright networks routing tools to mock backend answers deterministically during pipeline run integration
  await page.route('**/query', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ source: 'vector_engine', answer: 'Mocked legal matrix compliance terms match.' })
    });
  });

  const sendButton = page.locator('button:has-text("Send")');
  await sendButton.click();
});

Then('the interface should show a chat card containing an AI answer', async () => {
  const responseBubble = page.locator('p:has-text("Mocked legal matrix compliance terms match.")');
  await expect(responseBubble).toBeVisible({ timeout: 5000 });
});

Then('the data source badge indicator should show {string}', async (expectedSource: string) => {
  const badge = page.locator('span:has-text("Source:")');
  await expect(badge).toContainText(expectedSource);
});
