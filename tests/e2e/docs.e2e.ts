import {expect, test, type Page} from '@playwright/test';

async function expectTemplateChrome(page: Page, direction: 'ltr' | 'rtl') {
  await page.evaluate(() => document.fonts.ready);
  const font = await page.evaluate(() => ({
    ready: document.fonts.check('16px "Vazirmatn Variable"'),
    heading: getComputedStyle(document.querySelector('h1')!).fontFamily,
  }));
  expect(font.ready).toBe(true);
  expect(font.heading).toContain('Vazirmatn Variable');

  const hint = page.locator('.navbar__search [class*="searchHintContainer"]');
  await expect(hint).toBeVisible();
  const search = await page.locator('.navbar__search').evaluate((root) => {
    const input = root.querySelector<HTMLInputElement>('.navbar__search-input')!;
    const icon = root.querySelector<SVGElement>(':scope > svg')!;
    const shortcut = root.querySelector<HTMLElement>('[class*="searchHintContainer"]')!;
    const inputRect = input.getBoundingClientRect();
    const iconRect = icon.getBoundingClientRect();
    const shortcutRect = shortcut.getBoundingClientRect();
    const style = getComputedStyle(input);
    return {
      direction: style.direction,
      textAlign: style.textAlign,
      backgroundImage: style.backgroundImage,
      inputCenter: inputRect.left + inputRect.width / 2,
      iconCenter: iconRect.left + iconRect.width / 2,
      shortcutCenter: shortcutRect.left + shortcutRect.width / 2,
      separated: iconRect.right <= shortcutRect.left || shortcutRect.right <= iconRect.left,
    };
  });

  expect(search.direction).toBe(direction);
  expect(search.backgroundImage).toBe('none');
  expect(search.separated).toBe(true);
  if (direction === 'rtl') {
    expect(search.textAlign).toBe('right');
    expect(search.iconCenter).toBeGreaterThan(search.inputCenter);
    expect(search.shortcutCenter).toBeLessThan(search.inputCenter);
  } else {
    expect(search.iconCenter).toBeLessThan(search.inputCenter);
    expect(search.shortcutCenter).toBeGreaterThan(search.inputCenter);
  }
}

test('Persian documentation is the default RTL experience', async ({page}) => {
  await page.setViewportSize({width: 1280, height: 720});
  await page.goto('/');

  await expect(page).toHaveTitle(/مستندات Qbit Console/);
  await expect(page.getByText('مدیریت سرورهای ریموت شما')).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('lang', 'fa-IR');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await expect(page.locator('.navbar__search-input')).toBeVisible();
  await expect(page.getByRole('complementary', {name: 'ثبت و مدیریت سرور ریموت'})).toBeVisible();
  await expectTemplateChrome(page, 'rtl');

  const logoSpacing = await page.locator('.navbar__logo').evaluate((node) => {
    const style = getComputedStyle(node);
    return {left: style.marginLeft, right: style.marginRight};
  });
  expect(logoSpacing).toEqual({left: '8px', right: '0px'});
});

test('English documentation is available as an LTR locale', async ({page}) => {
  await page.setViewportSize({width: 1280, height: 720});
  await page.goto('/en/');

  await expect(page).toHaveTitle(/Qbit Console Docs/);
  await expect(page.getByText('Manage your remote servers')).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en-US');
  await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
  await expect(page.locator('.navbar__search-input')).toBeVisible();
  await expectTemplateChrome(page, 'ltr');

  const logoSpacing = await page.locator('.navbar__logo').evaluate((node) => {
    const style = getComputedStyle(node);
    return {left: style.marginLeft, right: style.marginRight};
  });
  expect(logoSpacing).toEqual({left: '0px', right: '8px'});
});

test('remote-server security guidance is reachable', async ({page}) => {
  await page.goto('/guide/remote-servers');

  await expect(page.getByRole('heading', {name: 'سرورهای ریموت', level: 1})).toBeVisible();
  await expect(page.getByText('اطلاعات محرمانه را وارد نکنید')).toBeVisible();
  await page.getByRole('link', {name: 'امنیت'}).first().click();
  await expect(page).toHaveURL(/\/guide\/security$/);
  await expect(page.getByRole('heading', {name: 'امنیت', level: 1})).toBeVisible();
});

test('remote operations and terminal guidance is available in both locales', async ({page}) => {
  await page.goto('/guide/remote-operations');
  await expect(page.getByRole('heading', {name: 'عملیات ریموت و ترمینال', level: 1})).toBeVisible();
  await expect(page.getByRole('heading', {name: 'ترمینال سطح‌بالا', level: 2})).toBeVisible();
  await expect(page.getByText('دریافت متریک تازه', {exact: false}).first()).toBeVisible();

  await page.goto('/en/guide/remote-operations');
  await expect(page.getByRole('heading', {name: 'Remote operations and terminal', level: 1})).toBeVisible();
  await expect(page.getByRole('heading', {name: 'Privileged terminal', level: 2})).toBeVisible();
  await expect(page.getByText('Collect fresh metrics', {exact: false}).first()).toBeVisible();
});

test('local search returns Persian and English documentation', async ({page}) => {
  await page.goto('/search?q=سرورهای%20ریموت');
  await expect(page.getByRole('link', {name: /سرورهای ریموت/}).first()).toBeVisible();

  await page.goto('/en/search?q=Remote%20servers');
  await expect(page.getByRole('link', {name: /Remote servers/i}).first()).toBeVisible();
});
