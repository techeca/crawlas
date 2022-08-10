//const request = require('request-promise-native');
import cheerio from 'cheerio';
import requestOpts from '../services/utils.js';
import Idol from '../models/idol.model.js';
import { recipeParse, descriptionParse } from '../services/parser-helpers.js';

//let body = '';

async function getIdols(url, pageNew) {
	requestOpts.url = url;
	await pageNew.goto(url, { waitUntil: ['networkidle2']});
		// Global initializations
		//body = $.html();
		const check404 = await pageNew.$eval('div.ak-404', () => true).catch(() => false);
		//div.ak-container.ak-panel.ak-crafts
		//const recipesItems = await pageNew.$
		if(check404){return {statusCode:'404'}}

		const innerContent = await pageNew.$eval('body', (el) => el.innerHTML);
		const haveRecipes = await pageNew.$eval('div.ak-container.ak-panel.ak-crafts', () => true).catch(() => false);
		const cheeriParser = cheerio.load(innerContent);
		//body = cheeriParser;
		const test = await cheeriParser('div.ak-nocontentpadding');
		//console.log('valor body cheeriParser '+test.html())
		// Description parse
		// This functions doesn't return description for idols
		// but we can use it to initialize
		const idol = new Idol(descriptionParse(cheeriParser, url));
		idol.level = Number(cheeriParser('.ak-encyclo-detail-level').text().replace(/^\D+/g, '').trim());

		parseIdolsUtils(idol, test);

		// Stat Parse
		idol.statistics = parseIdolsStat(cheeriParser);

		// Recipe Parse
		if(haveRecipes){
			idol.recipe = recipeParse(cheeriParser)
		}
		/*if (typeof cheeriParser('div.ak-container.ak-panel.ak-crafts') !== 'undefined') {
			idol.recipe = recipeParse(cheeriParser);
		}*/

		return idol;

}

function parseIdolsUtils(idol, body) {
	const $div = body[0].children;
	//console.log('valoe body en parseIdolsUtil')
	//console.log(body)
	//console.log('body[1] '+body[0].children)
	//console.log($('.ak-nocontentpadding').children);
	//console.log('valor de parseidolUtils '+test)
	//const $div = $[1].children;
	for (let i = 0; i < $div.length; i++) {
		if ($div[i].type !== 'div') {
			$div.splice(i, 1);
		}
	}
	for (let i = 0; i < $div.length; i++) {
		for (let j = 0; j < $div[i].children.length; j++) {
			const $actual = $div[i].children[j];
			if ($actual.type == 'tag' && $actual.name == 'div' && $actual.attribs.class == 'ak-panel-content') {
				if (i == 0) {
					idol.description = $actual.children[0].data.replace(/\n/g, '');
				} else if (i == 2) {
					idol.spell = $actual.children[0].data.replace(/\n/g, '');
				}
			}
		}
	}
}

function parseIdolsStat(body) {
	const $ = body;
	const stats = [];
	$('.ak-displaymode-col').find('div.ak-list-element').each(function (i, elem) {
		const str = $(this).find('.ak-title').text().replace(/\n/g, '');
		stats[stats.length] = {
			name: str.replace(/[0-9]/g, '').trim(),
			power: Number(str.replace(/^\D+/g, ''))
		};
	});
	return stats;
}

export default getIdols;
