import puppeteer from 'puppeteer';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const searchAndSavePDFLinks = async (company, year) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const query = `${company} ${year} climate change environment filetype:pdf`;

    await page.goto(`https://www.google.com/search?q=${encodeURIComponent(query)}`);

    const pdfLinks = await page.evaluate(() => {
        const anchors = Array.from(document.querySelectorAll('a'));
        return anchors
            .map(anchor => anchor.href)
            .filter(href => href.endsWith('.pdf'));
    });

    console.log(`Found ${pdfLinks.length} PDF links for ${company} in ${year}`);
    
    const linksFilePath = path.resolve(__dirname, 'pdf_links', `${company}_${year}_climate_environment.json`);
    await fs.ensureDir(path.dirname(linksFilePath));
    await fs.writeJson(linksFilePath, pdfLinks);

    await browser.close();
    return pdfLinks;
};

export default searchAndSavePDFLinks;
