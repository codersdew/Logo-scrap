const axios = require('axios');
const cheerio = require('cheerio');

async function startScraping(url) {
    try {
        const { data } = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        const $ = cheerio.load(data);
        
        $('img').each((i, el) => {
            const src = $(el).attr('src');
            if (src) {
                console.log(src);
            }
        });
    } catch (err) {
        console.log(err.message);
    }
}

startScraping('https://www.freeimages.com/search/logo');
