//const request = require('request-promise-native');
import cheerio from 'cheerio';
import requestOpts from '../services/utils.js';
import Set from '../models/set.model.js';
import { getId } from '../services/format-helpers.js';
import { effectParse, getCategoryType, descriptionParse } from '../services/parser-helpers.js';

let body = '';

async function getSets(url, pageNew) {
	requestOpts.url = url;
	await pageNew.goto(url, { waitUntil: ['networkidle2']});
		const check404 = await pageNew.$eval('div.ak-404', () => true).catch(() => false);
		if(check404){return {statusCode:'404'}}

		const innerContent = await pageNew.$eval('body', (el) => el.innerHTML);
		const cheeriParser = cheerio.load(innerContent);

		/// //// Set instance initializations with Item global structure ///////
		const set = new Set(descriptionParse(cheeriParser, url));
		let packSet = [];
		let packBonus = [];

		///Obtiene la composicion del SET
		cheeriParser('div.ak-container.ak-panel.ak-set-composition.ak-nocontentpadding').find('div.ak-panel-content').find('tr').each(function (i, element) {
			const id = getId(cheeriParser(this).find('td').eq(1).find('a').attr('href'));
			const glType = getCategoryType(cheeriParser(this).find('td').eq(1).find('div.ak-item-type-info').text().trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''));
			switch (glType) {
			case 'equipments':
				packSet.push({id:id, type:glType})
				//set.equipment_id = id;
				break;
			case 'weapons':
				packSet.push({id:id, type:glType})
				//set.weapon_id = id;
				break;
			}
		});

		/// //// Bonus Set parse ///////
		cheeriParser('div.ak-encyclo-detail-right').find('div.set-bonus-list').each(function (i, element) {
			const nbBonus = {
				number: i + 1,
				quantity: cheeriParser('select.ak-set-bonus-select.form-control').find('option').eq(i).text().replace('\n', '').trim(),
				stats: effectParse(cheeriParser(this).html())
			};
			packBonus.push(nbBonus)
		});

		set.equipment_id = packSet;
		set.bonus = packBonus;

		return set;

}

export default getSets;
