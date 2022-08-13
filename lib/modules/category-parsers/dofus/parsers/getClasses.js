//const request = require('request-promise-native');
import requestOpts from '../services/utils.js';
import cheerio from 'cheerio';
import Class from '../models/class.model.js';

//let body = '';

async function getClasses(url, pageNew) {
	requestOpts.url = url;
	await pageNew.goto(url, { waitUntil: ['networkidle2']});
		const check404 = await pageNew.$eval('div.ak-404', () => true).catch(() => false);
		if(check404){return {statusCode:'404'}}

		const innerContent = await pageNew.$eval('body', (el) => el.innerHTML);
		const cheeriParser = cheerio.load(innerContent);

		/// //// Class instance initializations with Item global structure ///////
		const classEntity = new Class(classeParsingInit(innerContent, url));

		// Role Parsing
		classEntity.role = roleParser(innerContent);

		// Spell Parsing
		classEntity.spell = spellListParser(innerContent, pageNew);
		return classEntity;
	//});
}

function classeParsingInit(body, url) {
	const $ = cheerio.load(body);
	const classeId = url.split('-')[0].replace(/^\D+/g, '');
	const name = url.split('-')[1].charAt(0).toUpperCase() + url.split('-')[1].slice(1);
	const imgUrl = $('.ak-entitylook').attr('src');
	const description = $('.ak-breed-description').text().replace(/[\r\n]/gm, '').trim(); //replace todas las \n
	return {
		_id: null,
		ankamaId: Number(classeId),
		name: name,
		type: 'classe',
		imgUrl: imgUrl,
		url: url,
		description: description
	};
}

function roleParser(body) {
	const $ = cheerio.load(body);
	const role = [];
	$('.ak-breed-roles-illu').find('span').each((i, elem) => {
		role[role.length] = elem.children[0].data;
	});
	return role;
}

function spellListParser(body) {

	/*const test = await pageNew.$eval('select.form-control.ak-details-select', () => true).catch(() => false); //Si no hay form de level returna false
		let body;

		if(test){
				await pageNew.select('[class="form-control ak-details-select"]', '100')
				await pageNew.waitForTimeout(1000); //hay que esperar por el cambio de contenido, no he probado con menos
				body = await pageNew.$eval('div.ak-container.ak-panel.ak-item-details-container', (el) => el.innerHTML);
			}else {

				body = await pageNew.$eval('div.ak-container.ak-panel.no-padding', (el) => el.innerHTML);
			}*/

	const $ = cheerio.load(body);
	const spellDetails = $('div.ak-spell-details').find('div.col-sm-10')
	const normalEffects = $('div.ak-spell-details').find('div.col-sm-6.ak-spell-details-effects').find('div.ak-list-element')
	//const criticalEffects = spellDetails('div.col-sm-6.ak-spell-details-effects.ak-spell-details-critical')
	//const othersCharac = spellDetails('div.ak-spell-details-other.clearfix')
	//console.log('nombre de hechizo en detalles')
	//console.log(spellDetails)
	//console.log($('div.ak-spell-details').find('span.ak-spell-description').html().split('<br>').text())
	const spell = [];
	$('.ak-spell-list-row').each((i, div) => {

		//get simple data
		let base = $(div).find('.ak-spell').not('.ak-variant').find('span').text().trim();
		let variant = $(div).find('.ak-variant').find('span').text().trim();
		base = base.split('\n');
		variant = variant.split('\n');
		if (base[0] == '') {
			base.splice(0, 1);
			variant.splice(0, 1);
		}

		const packSpellLevels = []
		//normal effects
		normalEffects.each((n, element) => {
				//console.log($(this).find('div.ak-main').find('div.ak-main-content').find('div.ak-content').find('div.ak-title').text())
				console.log($(element).html())
		})

		//save details

		const spellDescription = $('div.ak-spell-details').find('span.ak-spell-description').text() //descripcion hechizo
		//save data
		for (let i = 0; i < base.length; i++) {
			spell[spell.length] = {
				name: base[i],
				variant: variant[i],
				details: spellDescription,
				spellLevels: packSpellLevels
			};

		}
		//
	});
	return spell;
}

export default getClasses;
