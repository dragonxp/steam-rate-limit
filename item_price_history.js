import fetch from 'node-fetch';

const marketHashNames = [
    "Fracture%20Case",
    "Clutch%20Case",
    "Snakebite%20Case",
    "Prisma%202%20Case",
    "Chroma%203%20Case",
    "Revolution%20Case",
    "Dreams%20%26%20Nightmares%20Case",
    "Recoil%20Case",
    "Glove%20Case",
    "Gamma%202%20Case",
    "Operation%20Broken%20Fang%20Case",
    "Gamma%20Case",
    "CS20%20Case",
    "Antwerp%202022%20Contenders%20Autograph%20Capsule",
    "Sticker%20%7C%20Outsiders%20%7C%20Antwerp%202022",
    "Revolver%20Case",
    "Rio%202022%20Contenders%20Sticker%20Capsule",
    "Rio%202022%20Dust%20II%20Souvenir%20Package",
    "Operation%20Wildfire%20Case",
    "2020%20RMR%20Legends"
]

let index = 0
let bad = 0
let good = 0
let badCodes = new Set()

//command line arguments
//node index.js {time in ms}
const duration = process.argv[2] || 1000

const sendRequest = async (url) => {
	try {
		const response = await fetch(url, {
			method: 'GET'
		});
		if (response.status >= 200 && response.status < 300) {
            const htmlString = await response.text()
            const dataString = htmlString.split('var line1=')[1].split('g_timePriceHistoryEarliest')[0].split(';')[0]
            const prices = JSON.parse(dataString)
            console.log(prices[0], prices[prices.length - 1])
            good++
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
    console.log(`Sending start ${index} good ${good} bad ${bad} successRate ${((good / (good + bad)) * 100).toFixed(2)}%`)
    const url = "https://steamcommunity.com/market/listings/730/" + marketHashNames[index]
    sendRequest(url)
    index++
    if (index >= marketHashNames.length) index = 0
}, duration)