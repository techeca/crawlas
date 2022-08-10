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
		classEntity.spell = spellListParser(innerContent);
		return classEntity;
	//});
}

function classeParsingInit(body, url) {
	const $ = cheerio.load(body);
	const classeId = url.split('-')[0].replace(/^\D+/g, '');
	const name = url.split('-')[1].charAt(0).toUpperCase() + url.split('-')[1].slice(1);
	const imgUrl = $('.ak-entitylook').attr('src');
	const description = $('.ak-breed-description').text();
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
	const $ = cheerio.load(body);
	const spell = [];
	$('.ak-spell-list-row').each((i, div) => {
		let base = $(div).find('.ak-spell').not('.ak-variant').find('span').text();
		let variant = $(div).find('.ak-variant').find('span').text();
		base = base.split('\n');
		variant = variant.split('\n');
		if (base[0] == '') {
			base.splice(0, 1);
			variant.splice(0, 1);
		}
		for (let i = 0; i < base.length; i++) {
			spell[spell.length] = {
				name: base[i],
				variant: variant[i]
			};
		}
	});
	return spell;
}

export default getClasses;
