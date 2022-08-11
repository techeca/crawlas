//const request = require('request-promise-native');
import cheerio from 'cheerio';
import requestOpts from '../services/utils.js';
import Mount from '../models/mount.model.js';
import { effectParse, descriptionParse } from '../services/parser-helpers.js';

//let body = '';

async function getMounts(url, pageNew) {
	requestOpts.url = url;
	await pageNew.goto(url, { waitUntil: ['networkidle2']});
		/// //// Global initializations ///////
		const check404 = await pageNew.$eval('div.ak-404', () => true).catch(() => false);
		if(check404){return {statusCode:'404'}}

		const innerContent = await pageNew.$eval('body', (el) => el.innerHTML);
		const haveContent = await pageNew.$eval('div.ak-nocontentpadding', () => true).catch(() => false);
		const canGet = await pageNew.$eval('body > div.ak-mobile-menu-scroller > div.container.ak-main-container > div > div > div > main > div.ak-container.ak-main-center > div > div:nth-child(4)', () => true).catch(() => false);
		const haveCross = await pageNew.$eval('body > div.ak-mobile-menu-scroller > div.container.ak-main-container > div > div > div > main > div.ak-container.ak-main-center > div > div:nth-child(5)', () => true).catch(() => false);
		const cheeriParser = cheerio.load(innerContent);

		/// //// Mount instance initializations with Item global structure ///////
		const mount = new Mount(descriptionParse(cheeriParser, url));
		const packCross = [];
		mount.level = 100;

		/// //// Effects & condtions parse ///////
		if(haveContent){
			const $akContainer = cheeriParser('div.ak-nocontentpadding').find('div.row')

				$akContainer.eq(1).find('div.col-md-6').each(function (i, element) {
					const infoCategory = cheeriParser(this).find('div.ak-panel-title').text().trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
					categorySwitch(mount, infoCategory, cheeriParser(this).html());
				});
	  }

		//Como conseguirlo
		if(canGet){
			const $howGet = cheeriParser('body > div.ak-mobile-menu-scroller > div.container.ak-main-container > div > div > div > main > div.ak-container.ak-main-center > div > div:nth-child(4) > div.ak-panel-content').text().trim();
			mount.howGet = $howGet
		}

		//cruces posibles
		if(haveCross){
			const $cross = cheeriParser('body > div.ak-mobile-menu-scroller > div.container.ak-main-container > div > div > div > main > div.ak-container.ak-main-center > div > div:nth-child(5) > div.ak-panel-content') //.find('div.ak-container.ak-panel')
			$cross.find('div.ak-container.ak-panel').each(function (i, element) {
				const test0 = cheeriParser(this).find('div.col-md-6.text-center.ak-ride-parent').eq(0).find('a').text()
				const test1 = cheeriParser(this).find('div.col-md-6.text-center.ak-ride-parent').eq(1).find('a').text()
				packCross.push({idCross:i+1 , description:test0+' + '+test1})
			});
		}
		
		mount.cross = packCross;
		return mount;
}

function characteristicParse(mount, body) {
	const groupeElement = [];
	const $ = cheerio.load(body);
	$('div.ak-container.ak-panel').find('div.ak-list-element').each(function (i, element) {
		const spanTxt = $(this).find('div.ak-title').find('span').text();
		$(this).find('div.ak-title').find('span').remove();
		const characteristic = $(this).find('div.ak-title').text().trim() + ' ' + spanTxt;
		const elt = characteristic.substring(0, characteristic.indexOf(':')).trim();
		const subElement = characteristic.substring(characteristic.indexOf(':') + 1, characteristic.length).trim();
		groupeElement.push({ [elt]: subElement });
	});
	mount.characteristic = groupeElement;
}

function categorySwitch(mount, infoCategory, body) {
	switch (infoCategory) {
	case 'effets':
		mount.statistics = effectParse(body);
		break;
	case 'effects':
		mount.statistics = effectParse(body);
		break;
	case 'efectos':
		mount.statistics = effectParse(body);
		break;
	case 'caracteristicas':
		characteristicParse(mount, body);
		break;
	case 'characteristics':
		characteristicParse(mount, body);
		break;
	case 'caracteristiques':
		characteristicParse(mount, body);
		break;
	default:
		console.log('Sorry, we are out of ' + infoCategory + '.');
	}
}

export default getMounts;
