//const request = require('request-promise-native');
import requestOpts from '../services/utils.js';
import { descriptionParse } from '../services/parser-helpers.js';
import Resource from '../models/resource.model.js';
import cheerio from 'cheerio';

//let body = '';

async function getResources(url, pageNew) {
	requestOpts.url = url;
	await pageNew.goto(url, { waitUntil: ['networkidle2']});
		// Global initializations
		const check404 = await pageNew.$eval('div.ak-404', () => true).catch(() => false);
		if(check404){return {statusCode:'404'}}

		const innerContent = await pageNew.$eval('body', (el) => el.innerHTML);
		const cheeriParser = cheerio.load(innerContent);
		const haveRecipes = await pageNew.$eval('div.ak-container.ak-content-list.ak-displaymode-image-col', () => true).catch(() => false);

		/// //// Resource instance initializations with Item global structure ///////
		const resource = new Resource(descriptionParse(cheeriParser, url));

		/// //// Recipes for parse ///////
		if(haveRecipes){
			resource.recipe = recipeForParse(cheeriParser);
		}
		return resource;
}

export function	recipeForParse(body) {
		const item = [];
		const $ = body;
		$('div.ak-container.ak-content-list.ak-displaymode-image-col').find('div.row.ak-container').find('div.ak-column.ak-container.col-xs-12.col-md-6').each(function (i, element) {
			const setUrl = 'https://www.dofus.com' + $(this).find('div.ak-title').find('a').attr('href');
			const setId = $(this).find('div.ak-title').find('a').attr('href').replace(/\D/g, '');
			const setImage = $(this).find('div.ak-image').find('a').find('span.ak-linker').find('img').attr('src').replace('dofus/ng/img/../../../', '');
			const setName = $(this).find('div.ak-content').find('div.ak-title').find('a').find('span.ak-linker').text().trim();
			const setType = $(this).find('div.ak-content').find('div.ak-text').text().trim();
			const setlevel = $(this).find('div.ak-aside').text().replace(/\D/g, '').trim();
			//console.log(setName)
			const groupeElement = {
				[setName]: {
					'ankamaId': parseInt(setId, 10),
					'url': setUrl,
					'imgUrl': setImage,
					'profession': setType,
					'level': parseInt(setlevel, 10)
				}
			};
			item.push(groupeElement);
		})
		return item;
	};

export default getResources;
