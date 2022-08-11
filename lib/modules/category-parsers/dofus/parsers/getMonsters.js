//const request = require('request-promise-native');
import requestOpts from '../services/utils.js';
import Monster from '../models/monster.model.js';
import { getElement, getId } from '../services/format-helpers.js';
import { monsterParse } from '../services/parser-helpers.js';
import cheerio from 'cheerio';

let body = '';

async function getMonsters(url, pageNew) {
	requestOpts.url = url;
	await pageNew.goto(url, { waitUntil: ['networkidle2']});
		const check404 = await pageNew.$eval('div.ak-404', () => true).catch(() => false);
		if(check404){return {statusCode:'404'}}

		const innerContent = await pageNew.$eval('body', (el) => el.innerHTML);
		const cheeriParser = cheerio.load(innerContent);

		/// //// Global initializations ///////
		//body = $.html();

		/// //// Monster instance initializations with Item global structure ///////
		const monster = new Monster(monsterParse(cheeriParser, url));

		/// //// Stats and resistances parse ///////
		cheeriParser('div.ak-encyclo-detail-right').find('div.ak-container.ak-panel').each(function (i, element) {
			const stat = cheeriParser(this).find('div.ak-panel-title').text().trim();
			const statToTest = stat.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
			let groupeElementStats = [];
			let groupeElementResis = [];
			/// //// Stats parse ///////
			//let groupeElement;
			if (statToTest.includes('caracteristiques') || statToTest.includes('characteristics') || statToTest.includes('caracteristicas')) {
				let groupeElement;
				cheeriParser(this).find('div.ak-list-element').each(function (i, elt) {
					const stat = cheeriParser(this).find('div.ak-title').text().trim();
					let element = getElement(stat);
					element = element.charAt(0).toUpperCase() + element.slice(1);
					element = element.split(':')[0].trim();
					const numbers = [];
					stat.replace(/(-?\d[\d\.]*)/g, function (x) {
						const n = Number(x); if (x == n) { numbers.push(x); }
					});
					if (typeof numbers[1] == 'undefined') groupeElement = { [element]: { 'min': numbers[0], 'max': null } };
					else groupeElement = { [element]: { 'min': numbers[0], 'max': numbers[1] } };
					groupeElementStats.push(groupeElement)
				});
				//console.log(groupeElementStats)
				monster.statistics = groupeElementStats;
			}
			/// //// Resistances parse ///////
			if (statToTest.includes('résistances') || statToTest.includes('resistances') || statToTest.includes('resistencias')) {
				let groupeElement;
				cheeriParser(this).find('div.ak-list-element').each(function (i, elt) {
					const stat = cheeriParser(this).find('div.ak-title').text().trim();
					let element = getElement(stat);
					element = element.charAt(0).toUpperCase() + element.slice(1);
					element = element.split(':')[0].trim();
					const numbers = [];
					stat.replace(/(-?\d[\d\.]*)/g, function (x) {
						const n = Number(x); if (x == n) { numbers.push(x); }
					});
					if (typeof numbers[1] == 'undefined') groupeElement = { [element]: { 'min': numbers[0], 'max': null } };
					else groupeElement = { [element]: { 'min': numbers[0], 'max': numbers[1] } };
					groupeElementResis.push(groupeElement)
				});
				//console.log(groupeElementResis)
				monster.resistances = groupeElementResis;
			}


		});

		/// //// Areas and drops parse ///////
		cheeriParser('div.ak-container.ak-panel').each(function (i, elt) {
			const stat = cheeriParser(this).find('div.ak-panel-title').text().trim();
			const statToTest = stat.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
			let groupeElementBotin = [];
			/// //// Areas parse ///////
			if (statToTest.includes('zones') || statToTest.includes('areas') || statToTest.includes('zonas')) {
				monster.areas = cheeriParser(this).find('div.ak-panel-content').text().trim().split(', ');
			}
			/// //// Drops parse ///////
			if (statToTest.includes('butins') || statToTest.includes('drops') || statToTest.includes('botin')) {
				cheeriParser(this).find('div.ak-container.ak-content-list.ak-displaymode-image-col').find('div.ak-list-element').each(function (i, element) {
					const imgUrl = cheeriParser(this).find('div.ak-image').find('img').attr('src');
					let dropUrl = cheeriParser(this).find('a').attr('href');
					let levelItem = cheeriParser(this).find('div.ak-aside').text();
					let id = null;
					if (dropUrl !== undefined) {
						id = getId(dropUrl);
						dropUrl = 'https://www.dofus.com' + dropUrl;
					}
					else {
						id = null;
						dropUrl = null;
					}

					let name = cheeriParser(this).find('div.ak-content').find('div.ak-title').find('a').find('span.ak-linker').text().trim();
					//console.log(name)
					if(name === ''){
							//console.log('campo en blanco')
							name = cheeriParser(this).find('div.ak-content').find('div.ak-title').text().replace('\n', '').trim();
							//console.log(name)
					}

					//const name = cheeriParser(this).find('div.ak-content').find('div.ak-title').text();
					let dropPercent = cheeriParser(this).find('div.ak-text').find('div.ak-drop-percent').text().trim().split(' - ');
					if (dropPercent[1] == undefined) {
						dropPercent[0] = dropPercent[0].substring(0, dropPercent[0].length - 2);
						dropPercent = { 'min': dropPercent[0], 'max': null };
					}
					else {
						dropPercent[1] = dropPercent[1].substring(0, dropPercent[1].length - 2);
						dropPercent = { 'min': dropPercent[0], 'max': dropPercent[1] };
					}
					groupeElementBotin.push({ 'ankamaId': id, 'url': dropUrl, 'imgUrl': imgUrl, 'name': name, 'level': levelItem, 'dropPercent': dropPercent })
				});
				//console.log(groupeElementBotin)
				monster.drops = groupeElementBotin;
			}

		});

		return monster;

}

export default getMonsters;
