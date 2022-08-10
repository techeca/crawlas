//const request = require('request-promise-native');
import cheerio from 'cheerio';
import requestOpts from '../services/utils.js';
import Harness from '../models/harness.model.js';
import { recipeParse, descriptionParse } from '../services/parser-helpers.js';

let body = '';

async function getHarnesses(url, pageNew) {
	requestOpts.url = url;
	//console.log(url)
	await pageNew.goto(url, { waitUntil: ['networkidle2']});
		const check404 = await pageNew.$eval('div.ak-404', () => true).catch(() => false);
		if(check404){return {statusCode:'404'}}

		const innerContent = await pageNew.$eval('body', (el) => el.innerHTML);
		const haveRecipes = await pageNew.$eval('div.ak-container.ak-panel.ak-crafts', () => true).catch(() => false);
		const cheeriParser = cheerio.load(innerContent);
		/// //// Global initializations ///////
		body = cheeriParser

		/// //// Description parse ///////
		const harness = new Harness(descriptionParse(body, url));

		/// //// Recipes parse ///////
		if(haveRecipes){
			harnesses.recipe = recipeParse(body)
		}
	  /*if (typeof $('div.ak-container.ak-panel.ak-crafts') !== 'undefined') {
			harness.recipe = recipeParse(body);
		}*/
		return harness;

}

export default getHarnesses;
