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
		//body = $.html();
		const check404 = await pageNew.$eval('div.ak-404', () => true).catch(() => false);
		if(check404){return {statusCode:'404'}}

		const innerContent = await pageNew.$eval('body', (el) => el.innerHTML);
		const haveContent = await pageNew.$eval('div.ak-nocontentpadding', () => true).catch(() => false);
		const cheeriParser = cheerio.load(innerContent);

		/// //// Mount instance initializations with Item global structure ///////
		const mount = new Mount(descriptionParse(cheeriParser, url));
		mount.level = 100;

		//console.log(haveContent)
		/// //// Effects & condtions parse ///////
		//const $akContainer = cheeriParser('div.ak-nocontentpadding').eq(1).find('div.row');
		if(haveContent){
			//console.log('si hay contenido')
			const $akContainer = cheeriParser('div.ak-nocontentpadding').find('div.row')

			//console.log('valor de akContainer '+$akContainer.eq(1))
			//console.log('segundo intento eq[0].div.row '+cheeriParser('div.ak-nocontentpadding').eq(0).find('div.row'))
			//if (typeof $akContainer.eq(1) !== 'undefined') {
				$akContainer.eq(1).find('div.col-md-6').each(function (i, element) {
					const infoCategory = cheeriParser(this).find('div.ak-panel-title').text().trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
					//console.log(infoCategory)
					categorySwitch(mount, infoCategory, cheeriParser(this).html());
				});
		//}
	}
		/*if (typeof $akContainer.eq(1) !== 'undefined') {
			$akContainer.eq(1).find('div.col-md-6').each(function (i, element) {
				const infoCategory = cheeriParser(this).find('div.ak-panel-title').text().trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
				categorySwitch(mount, infoCategory, cheeriParser(this).html());
			});
		}*/
		return mount;

}

function characteristicParse(mount, body) {
	//console.log('en caracteristicas parse')
	const groupeElement = [];
	//console.log(body)
	const $ = cheerio.load(body);
	//console.log($('div.ak-container.ak-panel').find('div.ak-list-element').html())
	$('div.ak-container.ak-panel').find('div.ak-list-element').each(function (i, element) {
		const spanTxt = $(this).find('div.ak-title').find('span').text();
		$(this).find('div.ak-title').find('span').remove();
		const characteristic = $(this).find('div.ak-title').text().trim() + ' ' + spanTxt;
		const elt = characteristic.substring(0, characteristic.indexOf(':')).trim();
		const subElement = characteristic.substring(characteristic.indexOf(':') + 1, characteristic.length).trim();
		groupeElement.push({ [elt]: subElement });
		//console.log(characteristic)
	});
	//console.log(groupeElement)
	mount.characteristic = groupeElement;
}

function categorySwitch(mount, infoCategory, body) {
	//console.log('en category switch')
	switch (infoCategory) {
	case 'effets':
		mount.statistics = effectParse(body);
		break;
	case 'effects':
		mount.statistics = effectParse(body);
		break;
	case 'efectos':
		//console.log('efectos '+body)
		mount.statistics = effectParse(body);
		break;
	case 'caracteristicas':
		//console.log('caracteristicas '+body)
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
