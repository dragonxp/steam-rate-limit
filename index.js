import fetch from 'node-fetch';

const INDEX_STEP = 100
let index = 0
let bad = 0
let good = 0
let badCodes = new Set()

//command line arguments
//node index.js {time in ms}
const duration = process.argv[2]

const sendRequest = async (url) => {
	try {
		const response = await fetch(url, {
			method: 'GET'
		});
		if (response.status >= 200 && response.status < 300) {
            const data = await response.json();
            if (data.results) {
                good++
                if(data.results.length) index += INDEX_STEP
                else index = 0
            }
        } else {
            bad++
            badCodes.add(response.status)
            console.error(`Error: ${response.status} ${response.statusText}`);
            console.log(badCodes)
        }
	} catch (error) {
		console.error('There was a problem fetching the data:', error);
	}
}

setInterval(() => {
    console.log(`Sending start ${index} good ${good} bad ${bad} successRate ${(good / (good + bad)).toFixed(2)}`)
    const url = `https://steamcommunity.com/market/search/render/?appid=730&norender=1&count=${INDEX_STEP}&start=${index}`
    sendRequest(url)
}, duration)