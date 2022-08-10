import cheerio from 'cheerio';
import requestOpts from '../services/utils.js';
import Equipment from '../models/equipment.model.js';
import { sanatizer } from '../services/format-helpers.js';
import { descriptionParse, recipeParse, effectParse } from '../services/parser-helpers.js';

let body = '';

async function getEquipments(url, pageNew) {
	requestOpts.url = url;
	//CAMBIAR
	//return getHtmlContent(url, 'body').then(($) => {
	await pageNew.goto(url, { waitUntil: ['networkidle2']});
	const test = await pageNew.$eval('div.ak-404', () => true).catch(() => false);
	if(test){return {statusCode:'404'}}

		/// //// Global initializations ///////
		const innerContent = await pageNew.$eval('body', (el) => el.innerHTML);
		const cheeriParser = cheerio.load(innerContent);
		//body = cheeriParser;

	 	/// //// Equipment instance initializations with Item global structure ///////
		const equipment = new Equipment(descriptionParse(cheeriParser, url));

	 	/// //// Sets parse ///////
	 	 if (typeof cheeriParser('div.ak-container.ak-panel.ak-crafts').next('div.ak-container.ak-panel').find('div.ak-panel-title').find('a').attr('href') !== 'undefined') {
	 	 	equipment.setId = cheeriParser('div.ak-container.ak-panel.ak-crafts').next('div.ak-container.ak-panel').find('div.ak-panel-title').find('a').attr('href').replace(/\D/g, '');
	 	 }
		//
	 	// /// //// Effects & condtions parse ///////
	 	 const $akContainer = cheeriParser('div.ak-encyclo-detail-right.ak-nocontentpadding').find('div.ak-container.ak-panel');
		 if (typeof $akContainer.eq(1) !== 'undefined') {
	 	 	$akContainer.eq(1).find('div.col-sm-6').each(function (i, element) {
	 	 		const infoCategory = cheeriParser(this).find('div.ak-panel-title').text().trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
	 	 		categorySwitch(equipment, infoCategory, cheeriParser(this).html());
	 	 	});
	 	 }
		//
	 	// /// //// Recipes parse ///////
	 	 if (typeof cheeriParser('div.ak-container.ak-panel.ak-crafts') !== 'undefined') {
	 	 	equipment.recipe = recipeParse(cheeriParser);
	 	 }
	 	return equipment;
	// });
}

function conditionParse(equipment, body) {
	const $ = cheerio.load(body);
	let condition = $('div.ak-container.ak-panel.no-padding').find('div.ak-list-element').find('div.ak-title').remove('br').text().trim();
	condition = sanatizer(condition);
	let conditionTab = condition.split('et');
	conditionTab = conditionTab.map(function (string) {
		return sanatizer(string).trim();
	});
	equipment.conditions = conditionTab;
}

function categorySwitch(equipment, infoCategory, body) {
	switch (infoCategory) {
	case 'effets':
		equipment.statistics = effectParse(body);
		break;
	case 'effects':
		equipment.statistics = effectParse(body);
		break;
	case 'efectos':
		equipment.statistics = effectParse(body);
		break;
	case 'conditions':
		conditionParse(equipment, body);
		break;
	case 'condiciones':
		conditionParse(equipment, body);
		break;
        // default:
        // 	console.log('From getEquipments : Sorry, there is no ' + infoCategory + '.');
	}
}

export default getEquipments;
