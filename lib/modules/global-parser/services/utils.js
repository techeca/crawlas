import { gamesConf } from '../../../conf/global.conf.js';
import errorHandler from '../../../services/errorHandler.js';
import cheerio from 'cheerio';
import { writeFileSync } from '../../../services/utils.js';
import * as fs from 'fs';

export const requestOpts = {
	url: '',
	method: 'GET',
	transform: function (body) {
		return cheerio.load(body);
	}
};

export function gameUrlListSwitcher(cmdResponse) {
	try {
		let responseUser = cmdResponse
		//console.log(typeof cmdResponse)
		if(typeof cmdResponse == 'string'){  // == verifica el contenido, === contenido y tipo
			responseUser = JSON.parse(responseUser)
		}

		//const jsonGamesConf = JSON.parse(gamesConf)
		//console.log('valor de cmdResponse '+responseUser)
		//console.log('valor de cmdResponse.game '+responseUser.game)
		//console.log('valor de cmdResponse.game '+responseUser.category)
		//console.log('valor de cmdResponse typeof '+typeof cmdResponse)
		//console.log('valor de gamesConf typeof '+typeof gamesConf)
		//console.log('valor de gamesConf.games[dofus] '+gamesConf.games[responseUser.game])

		//console.log(gamesConf.games[cmdResponse.game])


		const url = gamesConf.games &&
			gamesConf.games[responseUser.game] &&
			gamesConf.games[responseUser.game].languages &&
			gamesConf.games[responseUser.game].languages[responseUser.language] &&
			gamesConf.games[responseUser.game].languages[responseUser.language][responseUser.category];

		//console.log('url valor: '+url)

		if (!url) throw { name: 'gameUrlListSwitcher', message: 'No game corresponding in global.conf.js' };
		return url;
	} catch (error) {
		new errorHandler(error);
	}
}

export function maxItemControl(init) {
	//console.log('en max item control')
	//console.log(cheerio.load(init.$))
	//console.log(init.$('.ak-panel-content'))
	const cheeriParser = cheerio.load(init.$)
	//console.log( Number(cheeriParser('div.ak-list-info > strong').text()) === 0 ? cheeriParser('tbody > tr').length : Number(cheeriParser('div.ak-list-info > strong').text()))

	if (init.itemCategory === 'classe') {
		const realMaxItem = Number(cheeriParser('.ak-content-sections').find('.ak-section').length);
		console.log('realmacItem classe: '+realMaxItem)
		if (init.maxItem >= realMaxItem || init.all === true) init.maxItem = realMaxItem; // security line to avoid overpasing the real amont of items & to take care about 'all' value if true
	}
	else {
		const realMaxItem = Number(cheeriParser('div.ak-list-info > strong').text()) === 0 ? cheeriParser('tbody > tr').length : Number(cheeriParser('div.ak-list-info > strong').text());
		if (init.maxItem >= realMaxItem || init.all === true) init.maxItem = realMaxItem; // security line to avoid overpasing the real amont of items & to take care about 'all' value if true
	}
	return init.maxItem;
}

export function parseEachPageLinksClass(init) {
	const links = [];
	init.$('.ak-content-sections').find('.ak-section').each(function (i, div) {
		if (!init.all) if (links.length >= init.maxItem) return false;
		const link = init.globalUrl + init.$(this).find('a').attr('href');
		links.push(link);
	});

	return links;
}

export function gameConfParserSwitcher(game) {
	try {
		const parserList = gamesConf.games[game] && gamesConf.games[game].conf;
		if (!parserList) throw { name: 'gameConfParserSwitcher', message: 'No game corresponding to ' + game + ' in global.conf.js' };
		return parserList;
	} catch (error) {
		new errorHandler(error);
	}
}

export function mongoImport(category, game) {
	try {
		let items = fs.readFileSync(process.cwd() + '/data/' + game + '/' + category + '.json', 'utf8');
		items = items.replace(/,{"_id"/g, '{"_id"');
		items = items.replace(/,null/g, '');
		items = items.substring(1, items.length - 1);
		writeFileSync(process.cwd() + '/data/' + game + '/mongo/' + category + '_mongo.json', items);
	} catch (error) {
		new errorHandler(error);
	}
}
