import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
const browser = await chromium.launch({headless:true});
const page = await browser.newPage();
await page.goto('http://localhost:5173');
assert.equal(await page.locator('body').evaluate(el=>el.style.overflow),'hidden');
await page.getByRole('button',{name:'Hap ftesën e dasmës'}).click();
await page.locator('.gate').waitFor({state:'detached'});
assert.notEqual(await page.locator('body').evaluate(el=>el.style.overflow),'hidden');
assert.deepEqual(await page.locator('main > *').evaluateAll(elements => elements.map(el => el.className || el.tagName.toLowerCase())), ['hero','invitation-note','section ','section venue-section','footer']);
assert.equal(await page.locator('.gate, form, audio, details').count(), 0);
assert.equal(await page.locator('.countdown > div').count(), 4);
for (const width of [390,1440]) {
 await page.setViewportSize({width,height:900});
 assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
}
const downloading = page.waitForEvent('download');
await page.getByRole('button',{name:'Shto në kalendar'}).click();
assert.equal((await downloading).suggestedFilename(),'Melsiana-Amarildo.ics');
await browser.close();
console.log('PASS: selected sections, order, countdown, responsive widths and calendar.');
