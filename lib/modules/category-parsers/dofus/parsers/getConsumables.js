//const request = require('request-promise-native');
import cheerio from 'cheerio';
import requestOpts from '../services/utils.js';
import Consumable from '../models/consumable.model.js';
import { sanatizer } from '../services/format-helpers.js';
import { effectParse, recipeParse, descriptionParse } from '../services/parser-helpers.js';

let body = '';

async function getConsumables(url, pageNew) {
	requestOpts.url = url;
	await pageNew.goto(url, { waitUntil: ['networkidle2']});
		const check404 = await pageNew.$eval('div.ak-404', () => true).catch(() => false);
		if(check404){return {statusCode:'404'}}
		/// //// Global initializations ///////
		//body = $.html();
		const innerContent = await pageNew.$eval('body', (el) => el.innerHTML);
		const cheeriParser = cheerio.load(innerContent);

		/// //// Consumable instance initializations with Item global structure ///////
		const consumable = new Consumable(descriptionParse(cheeriParser, url));

		/// //// Effects & condtions parse ///////
		const $akContainer = cheeriParser('div.ak-encyclo-detail-right.ak-nocontentpadding').find('div.ak-container.ak-panel');
		if (typeof $akContainer.eq(1) !== 'undefined') {
			$akContainer.eq(1).find('div.col-sm-6').each(function (i, element) {
				const infoCategory = cheeriParser(this).find('div.ak-panel-title').text().trim().toLowerCase();
				categorySwitch(infoCategory, cheeriParser(this).html(), consumable);
			});
		}

		/// //// Recipes parse ///////
		if (typeof cheeriParser('div.ak-container.ak-panel.ak-crafts') !== 'undefined') {
			consumable.recipe = recipeParse(cheeriParser);
		}
		return consumable;

}

function conditionParse(body, consumable) {
	const $ = cheerio.load(body);
	let condition = $('div.ak-container.ak-panel.no-padding').find('div.ak-list-element').find('div.ak-title').remove('br').text().trim();
	condition = sanatizer(condition);
	let conditionTab = condition.split('et');
	conditionTab = conditionTab.map(function (string) {
		return sanatizer(string).trim();
	});
	consumable.conditions = conditionTab;
}

function categorySwitch(infoCategory, body, consumable) {
	switch (infoCategory) {
	case 'effets':
		consumable.statistics = effectParse(body);
		break;
	case 'effects':
		consumable.statistics = effectParse(body);
		break;
	case 'efectos':
		consumable.statistics = effectParse(body);
		break;
	case 'conditions':
		conditionParse(body, consumable);
		break;
	case 'condiciones':
		conditionParse(body, consumable);
		break;
		// default:
		// 	console.log('Sorry, there is no: ' + infoCategory + 'or consumable without effect (in this case don\'t take attention to this msg');
	}
}

export default getConsumables;
