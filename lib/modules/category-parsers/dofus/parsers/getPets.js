import cheerio from 'cheerio';
import requestOpts from '../services/utils.js';
import Pet from '../models/pet.model.js';
import { sanatizer } from '../services/format-helpers.js';
import { descriptionParse, effectParse, statsRequest } from '../services/parser-helpers.js';

let body = '';

async function getPets(url, pageNew) {
	requestOpts.url = url;
	await pageNew.goto(url, { waitUntil: ['networkidle2']});
	//await pageNew.$('tbody'); //.then(console.log(`Recovering item data from web `))

	const test = await pageNew.$eval('div.ak-404', () => true).catch(() => false);

	if(test){return {statusCode:'404'}}

		/// //// Global initializations ///////
		const innerContent = await pageNew.$eval('body', (el) => el.innerHTML);
		const cheeriParser = cheerio.load(innerContent);
		body = cheeriParser;
		/// //// Pet instance initializations with Item global structure ///////
		///descripcion
		const pet = new Pet(descriptionParse(body, url));

		const haveStats = await pageNew.$eval('div.ak-container.ak-panel.ak-item-details-container', () => true).catch(() => false);
		const haveCond = await pageNew.$eval('div.ak-container.ak-panel.no-padding', () => true).catch(() => false);

		/// //// Effects & Condtions & Characteristics parse ///////
		//stats
		if(haveStats){
			pet.statistics = effectParse(await statsRequest(url, pageNew));
		}

		//condiciones
		if(haveCond){
			const $akContainer = await cheeriParser('div.ak-container.ak-panel.no-padding');
			const infoCategory = $akContainer.find('div.ak-panel-title').text().trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
			categorySwitch(pet, infoCategory, $akContainer.find('div.ak-panel-content'));
		}

		return pet;

}

function conditionParse(pet, body) {
	//const $ = body;
	let condition = body.find('div.ak-list-element').find('div.ak-title').remove('br').text().trim();
	condition = sanatizer(condition);
	let conditionTab = condition.split('et');
	conditionTab = conditionTab.map(function (string) {
		return sanatizer(string).trim();
	});
	pet.conditions = conditionTab;
}

async function categorySwitch(pet, infoCategory, body) {
	switch (infoCategory) {
	case 'conditions':
		conditionParse(pet, body);
		break;
	case 'condiciones':
		conditionParse(pet, body);
		break;
        // default:
        // 	console.log('Sorry, we are out of ' + infoCategory + '.');
	}
}

export default getPets;
