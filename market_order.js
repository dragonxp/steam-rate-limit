import fetch from 'node-fetch';
import crypto from 'crypto';

//command line arguments
//node index.js {time in ms}
const duration = process.argv[2] || 1000

const INDEX_STEP = 100
let index = 0
let nameString = ""

const sendRequest = async (url) => {
	try {
		const response = await fetch(url, {
			method: 'GET'
		});
		if (response.status >= 200 && response.status < 300) {
            const data = await response.json();
            let str = ""
            data.results.forEach(d => str += d.hash_name)
            return str
        } else {
            console.error(`Error: ${response.status} ${response.statusText}`);
        }
	} catch (error) {
		console.error('There was a problem fetching the data:', error);
	}
}

setInterval(async () => {
    const url = `https://steamcommunity.com/market/search/render/?appid=730&norender=1&sort_column=popular&sort_dir=desc&count=${INDEX_STEP}&start=${index}`
    const response = await sendRequest(url)
    nameString += response
    index += INDEX_STEP
    if (index >= 400) {
        index = 0
        nameString = ""
        const hash = crypto.createHash('sha256').update(nameString).digest('hex');
        console.log(new Date().toISOString(), hash)
    }
}, duration)