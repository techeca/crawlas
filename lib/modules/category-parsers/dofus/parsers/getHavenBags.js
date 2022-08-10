//import request from 'request-promise-native';
import cheerio from 'cheerio';
import requestOpts from '../services/utils.js';
import HavenBag from '../models/havenbag.model.js';
import { normalizeText } from '../services/format-helpers.js';
import { descriptionParse } from '../services/parser-helpers.js';

const tabMapping = {
	'meuble': parseFurnitures,
	'furniture': parseFurnitures,
	'decoration': parseDecors,
	'decor': parseDecors,
	'sol': parseGrounds,
	'ground': parseGrounds,
	'muebles': parseFurnitures,
	'decoracion': parseDecors,
	'suelo': parseGrounds,
};

let body = '';

async function getHavenBags(url, pageNew) {
	requestOpts.url = url;
	await pageNew.goto(url, { waitUntil: ['networkidle2']});
		const check404 = await pageNew.$eval('div.ak-404', () => true).catch(() => false);
		if(check404){return {statusCode:'404'}}

		const innerContent = await pageNew.$eval('body', (el) => el.innerHTML);
		const cheeriParser = cheerio.load(innerContent);

		// Description parse
		// This functions doesn't return description for haven bags
		// but we can use it to initialize
		const havenBag = new HavenBag(descriptionParse(cheeriParser, url));
		
		//const $tabs = cheeriParser('div.ak-havenbags-tabs').find('div.ak-tab');
		//console.log($tabs)

		/*$tabs.each(function (i, element) {
			const tab = cheeriParser(element);
			const tabId = tab.attr('id');

			const tabName = normalizeText(cheeriParser(element).find('a[href="#' + tabId + '"]').text());
			//const tabFunction = typeof tabMapping[tabName] !== 'undefined' ? tabMapping[tabName] : null;

			//console.log('element '+element)
			//console.log('tab html '+tab)
			console.log('tabId '+tabId)
			console.log('tabName '+tabName)

			/*if (tabFunction) {
				tabFunction(havenBag, tab);
			}*/
		//});*/

		return havenBag;
	//});
}

function parseFurnitures(havenBag, tabContainer) {
	havenBag.furnitures = extractFurnitures(tabContainer);
}

function parseDecors(havenBag, tabContainer) {
	havenBag.decors = extractFurnitures(tabContainer);
}

function parseGrounds(havenBag, tabContainer) {
	havenBag.grounds = extractFurnitures(tabContainer);
}

function extractFurnitures(tabContainer) {
	const furnitures = [];

	tabContainer.find('div.ak-furniture-container').each(function (i, element) {
		const $ = cheerio.load(tabContainer);
		const imgUrl = $(element).find('img').attr('src');

		furnitures.push(imgUrl);
	});

	return furnitures;
}

export default getHavenBags;
