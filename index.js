import express from 'express';
import searchAndSavePDFLinks from './scrapper.js';
import path from 'path';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';
console.log('Hello World');
// Get __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
searchAndSavePDFLinks('apple', '2020');

app.get('/scrape-pdfs', async (req, res) => {
    const { company, year } = req.query;

    if (!company || !year) {
        return res.status(400).send('Company and year are required');
    }

    try {
        const pdfLinks = await searchAndSavePDFLinks(company, year);
        res.json(pdfLinks);
    } catch (error) {
        console.error('Error during scraping:', error);
        res.status(500).send('Error during scraping');
    }
});

 

const PORT = process.env.PORT || 9090;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
