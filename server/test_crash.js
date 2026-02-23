const puppeteer = require('puppeteer');

(async () => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        page.on('pageerror', error => {
            console.error('PAGE_ERROR:', error.message);
            console.error(error.stack);
        });

        page.on('console', msg => {
            if (msg.type() === 'error') {
                console.error('CONSOLE_ERROR:', msg.text());
            }
        });

        console.log("Navigating...");
        await page.goto('http://localhost:5173/add-service-job', { waitUntil: 'networkidle2' });

        console.log("Waiting for select...");
        await page.waitForSelector('select');

        console.log("Selecting first customer...");
        const selectElem = await page.$('select');
        const optionValues = await page.evaluate(el => Array.from(el.options).map(o => o.value).filter(v => v !== ""), selectElem);
        await page.select('select', optionValues[0]);

        console.log("Submitting form...");
        await page.click('button[type="submit"]');

        await new Promise(r => setTimeout(r, 2000));
        await browser.close();
        console.log("Done.");
    } catch (err) {
        console.error("Test script failed:", err);
    }
})();
