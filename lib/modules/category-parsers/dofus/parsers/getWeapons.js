//const request = require('request-promise-native');
import cheerio from 'cheerio';
import requestOpts from '../services/utils.js';
import Weapon from '../models/weapon.model.js';
import { sanatizer } from '../services/format-helpers.js';
import { effectParse, recipeParse, descriptionParse } from '../services/parser-helpers.js';

//let body = '';

async function getWeapons(url, pageNew) {
	requestOpts.url = url;
	await pageNew.goto(url, { waitUntil: ['networkidle2']});
		const check404 = await pageNew.$eval('div.ak-404', () => true).catch(() => false);
		if(check404){return {statusCode:'404'}}
		await pageNew.waitForTimeout(1000);

		const innerContent = await pageNew.$eval('body', (el) => el.innerHTML);
		const cheeriParser = cheerio.load(innerContent);

		/// //// Weapon instance initializations with Item global structure ///////
		const weapon = new Weapon(descriptionParse(cheeriParser, url));
		/// //// Sets parse ///////
		if (typeof cheeriParser('div.ak-container.ak-panel.ak-crafts').next('div.ak-container.ak-panel').find('div.ak-panel-title').find('a').attr('href') !== 'undefined') {
			const test = cheeriParser('div.ak-container.ak-panel.ak-crafts').next('div.ak-container.ak-panel').find('div.ak-panel-title').find('a').attr('href').replace(/\D/g, '')
			weapon.setId = cheeriParser('div.ak-container.ak-panel.ak-crafts').next('div.ak-container.ak-panel').find('div.ak-panel-title').find('a').attr('href').replace(/\D/g, '');
		}

		/// //// Effects & Condtions & Characteristics parse ///////
		const $akContainer = cheeriParser('div.ak-encyclo-detail-right.ak-nocontentpadding').find('div.ak-container.ak-panel');
		if (typeof $akContainer.eq(1) !== 'undefined') {
			$akContainer.eq(1).find('div.col-sm-6').each(function (i, element) {
				if (cheeriParser(this).find('div.ak-container.ak-panel').eq(1).html() !== null) {
					//condiciones
					categorySwitch(weapon ,cheeriParser(this).find('div.ak-container.ak-panel').eq(1).find('div.ak-panel-title').text().trim().toLowerCase(), cheeriParser(this).find('div.ak-container.ak-panel').eq(1).html());
				}
				//efectos
				const infoCategory = cheeriParser(this).find('div.ak-container.ak-panel').eq(0).find('div.ak-panel-title').text().trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
				categorySwitch(weapon, infoCategory, cheeriParser(this).html());
			});
		}

		/// //// Recipes parse ///////
		if (typeof cheeriParser('div.ak-container.ak-panel.ak-crafts') !== 'undefined') {
			weapon.recipe = recipeParse(cheeriParser);
		}
		return weapon;
}

function conditionParse(weapon, body) {
	//console.log('entramos en conditionParse')
	const $ = cheerio.load(body);
	let condition = $('div.ak-panel-content').find('div.ak-list-element').find('div.ak-title').remove('br').text().trim();
	condition = sanatizer(condition);
	let conditionTab = condition.split('et'); //'y' en frances? //por el momento se guarda como una cadena de string
	conditionTab.map(function (string) {
		return sanatizer(string).trim();
	});
	weapon.conditions = conditionTab;
}

function characteristicParse(weapon, body) {
	const $ = cheerio.load(body);
	let groupeCharact = [];
	$('div.ak-container.ak-panel.no-padding').eq(0).find('div.ak-list-element').each(function (i, element) {
		const spanTxt = $(this).find('div.ak-title').find('span').text();
		$(this).find('div.ak-title').find('span').remove();
		const characteristic = $(this).find('div.ak-title').text().trim() + ' ' + spanTxt;
		const elt = characteristic.substring(0, characteristic.indexOf(':')).trim();
		const subElement = characteristic.substring(characteristic.indexOf(':') + 1, characteristic.length).trim();
		const groupeElement = { [elt]: subElement };

		groupeCharact.push(groupeElement)
	});
	weapon.characteristics = groupeCharact;
}

function categorySwitch(weapon, infoCategory, body) {
	switch (infoCategory) {
	case 'effets':
		weapon.statistics = effectParse(body);
		break;
	case 'effects':
		weapon.statistics = effectParse(body);
		break;
	case 'efectos':
		weapon.statistics = effectParse(body);
		break;
	case 'characteristics':
		characteristicParse(weapon, body);
		break;
	case 'caracteristiques':
		characteristicParse(weapon, body);
		break;
	case 'caracteristicas':
		characteristicParse(weapon, body);
		break;
	case 'conditions':
		conditionParse(weapon, body);
		break;
	case 'condiciones':
		conditionParse(weapon, body);
		break;
        // default:
        // 	console.log('Sorry, we are out of ' + infoCategory + '.');
	}
}

export default getWeapons;
