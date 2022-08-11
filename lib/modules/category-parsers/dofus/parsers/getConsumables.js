//const request = require('request-promise-native');
import cheerio from 'cheerio';
import requestOpts from '../services/utils.js';
import Consumable from '../models/consumable.model.js';
import { sanatizer } from '../services/format-helpers.js';
import { effectParse, recipeParse, descriptionParse } from '../services/parser-helpers.js';

let body = '';
const RECIPES_LANG = ['recetas', 'craft', 'recettes']

async function getConsumables(url, pageNew) {
	requestOpts.url = url;
	await pageNew.goto(url, { waitUntil: ['networkidle2']});
		const check404 = await pageNew.$eval('div.ak-404', () => true).catch(() => false);
		if(check404){return {statusCode:'404'}}
		/// //// Global initializations ///////
		const innerContent = await pageNew.$eval('body', (el) => el.innerHTML);
		const cheeriParser = cheerio.load(innerContent);

		/// //// Consumable instance initializations with Item global structure ///////
		const consumable = new Consumable(descriptionParse(cheeriParser, url));
		const packToCraft = []

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

		//objetos en los que se utiliza este item para fabricarlo
		if(RECIPES_LANG.some((v) => cheeriParser('body > div.ak-mobile-menu-scroller > div.container.ak-main-container > div > div > div > main > div.ak-container.ak-main-center > div > div:nth-child(5) > div.ak-panel-title').text().toLowerCase().includes(v))) {
			const $akContToCraft = cheeriParser('body > div.ak-mobile-menu-scroller > div.container.ak-main-container > div > div > div > main > div.ak-container.ak-main-center > div > div:nth-child(5)')

				$akContToCraft.find('div.row.ak-container').find('div.ak-column.ak-container.col-xs-12.col-md-6').each(function (i, element) {
					const idItem = cheeriParser(this).find('div.ak-list-element').find('div.ak-main').find('div.ak-main-content').find('div.ak-content').find('div.ak-title').find('a').attr('href').replace(/\D/g, '');
					const nameItem = cheeriParser(this).find('div.ak-list-element').find('div.ak-main').find('div.ak-main-content').find('div.ak-content').find('div.ak-title').find('span.ak-linker').text();
					const professionItem = cheeriParser(this).find('div.ak-list-element').find('div.ak-main').find('div.ak-main-content').find('div.ak-content').find('div.ak-text').text();
					const urlItem = cheeriParser(this).find('div.ak-list-element').find('div.ak-main').find('div.ak-main-content').find('div.ak-content').find('div.ak-title').find('a').attr('href');
					const levelItem = cheeriParser(this).find('div.ak-list-element').find('div.ak-main').find('div.ak-main-content').find('div.ak-aside').text()
					packToCraft.push({id:idItem, url:urlItem, name:nameItem, profession:professionItem, level:levelItem})
				});
		}

		consumable.toCraft = packToCraft;

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
