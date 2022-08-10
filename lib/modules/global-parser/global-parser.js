import puppeteer from 'puppeteer';
import cheerio from 'cheerio';
import clui from 'clui';
import * as fs from 'fs';
import { writeFileSync } from '../../services/utils.js';
import errorHandler from '../../services/errorHandler.js';
import { requestOpts, gameUrlListSwitcher, maxItemControl, parseEachPageLinksClass, mongoImport } from './services/utils.js';
import getItems from './getItems.js'

const { Spinner } =  clui;
const NB_ITEM_PER_PAGE = 96;
const initData = {
	url: null,
	globalUrl: null,
	itemCategory: null,
	game: null,
	maxItem: null,
	all: true,
	links: [],
	$: null
};

//Setea valores introducidos por usuario
export async function parserInit(cmdResponse) {
	console.log(' Crawler in progress... It could take some time ')
	const pkg = new Spinner(' ', ['⣾', '⣽', '⣻', '⢿', '⡿', '⣟', '⣯', '⣷']);
	pkg.start();
	initData.game = cmdResponse.game;
	initData.maxItem = cmdResponse.maxItem;
	initData.all = cmdResponse.all;
	initData.itemCategory = cmdResponse.category;
	initData.url = await gameUrlListSwitcher(cmdResponse);
	//console.log('respuesta de usuario url init.Url '+initData.url)
	//console.log('respuesta de usuario global por respuesta init.Url '+)
	//gameUrlListSwitcher(cmdResponse).substring(0, gameUrlListSwitcher(cmdResponse).indexOf('.com/') + 4)
	initData.globalUrl = await gameUrlListSwitcher(cmdResponse).substring(0, gameUrlListSwitcher(cmdResponse).indexOf('.com/') + 4);
	//initData.globalUrl = await initData.url.substring(0, initData.url.indexOf('.com/') + 4);
	requestOpts.url = await gameUrlListSwitcher(cmdResponse);
	//console.log(gameUrlListSwitcher(cmdResponse))
}

//Inicia chronium y obtiene html
/*export async function getHtmlContent(url, element){
	return await puppeteer.launch({ headless: false }) //con true no funciona
								 .then( async browser => {
									 console.log(url)
									 const pageNew = await browser.newPage();
									 await pageNew.setViewport({ width:800, height:600 });
									 await pageNew.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64)');  //user agent
									 await pageNew.goto(url, { waitUntil: ['networkidle2']});
									 await pageNew.$('tbody').then(console.log(`Recovering data from web `))	//esperamos que tabla de contenido está cargado
									 return await pageNew.$eval(element, (el) => el.innerHTML).finally(await browser.close());
								 });
}*/

//Obtiene links de objetos
export async function getPagesLinks(pageNew) {
	//listo //casi //opciones UI
	//Se genera la cantidad de items desde html obtenido
	await pageNew.goto(requestOpts.url, { waitUntil: ['networkidle2']});
	await pageNew.waitForSelector('[class="ak-backtotop"]').then(`Recovering data from web `); //prueba para cuando la web hace esaperar 5 seg
	//await pageNew.$('tbody').then(console.log(`Recovering data from web `));

	initData.$ = await pageNew.$eval('body', (el) => el.innerHTML);
	initData.maxItem = maxItemControl(initData);

	if (initData.itemCategory == 'classe') {
		const cheeriParser = initData
		cheeriParser.$ = cheerio.load(cheeriParser.$)
	 	initData.links = initData.links.concat(parseEachPageLinksClass(cheeriParser));
	 }
	 else {
 	 	const nbPageToParse = Math.ceil(initData.maxItem / NB_ITEM_PER_PAGE);
 	 	for (let page = 1; page <= nbPageToParse; page++) {
 	 		requestOpts.url = initData.url + '&page=' + page;
			await pageNew.goto(requestOpts.url, { waitUntil: ['networkidle2']}).catch(err => new errorHandler(err))
			await pageNew.$('tbody').then(console.log(`Recovering data from web `));
			const $ = await pageNew.$eval('body', (el) => el.innerHTML);;
			//const $ = await request(requestOpts).catch(err => new errorHandler(err));
 	 		parseEachPageLinks($);
 	 	}
	}

	 writeFileSync('./data/links/' + initData.itemCategory + '_links.json', JSON.stringify(initData.links));
	 console.log(initData.links.length+` Items descargados`) //Items obtenidos
	 console.log(initData.maxItem+` Items totales`) //Items totales
	 console.log('\x1b[36m%s\x1b[0m', '\n SUCCESS : all item(s) links crawled.');
	 console.log('\x1b[36m%s\x1b[0m', '\n START of item(s) crawling.');
}

function parseEachPageLinks($) {
	const cheeriParser = cheerio.load($)
	cheeriParser('tbody').find('tr').each(function (i, tr) {
		if (!initData.all) if (initData.links.length >= initData.maxItem) return false;
		const link = initData.globalUrl + cheeriParser(this).find('td').eq(1).find('a').attr('href');
		initData.links.push(link);
	});
}

export async function parserProcess(category, links, game, pageNew) {
	try {
		//console.log('desde parse process '+category)
		//console.log(typeof category)

		const items = await getItems(category, links, game, pageNew);
		category = category.replace(/ /g, '');
		if (fs.existsSync('./data/links/resume.json')) fs.unlinkSync('./data/links/resume.json');
		if (fs.existsSync('./data/links/' + category + '_links.json')) fs.unlinkSync('./data/links/' + category + '_links.json');
		writeFileSync('./data/' + game + '/' + category + '.json', JSON.stringify(items, null, 4));
		mongoImport(category, game);
		return { 'numberItemParsed': items.length, 'categoryName': category };
	} catch (err) {
		new errorHandler(err);
	}
}
