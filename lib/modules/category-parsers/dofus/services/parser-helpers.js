import cheerio from 'cheerio';
import { getId, getElement, getDate, sanatizer } from './format-helpers.js';

export function	descriptionParse(body, url) {
		let type = null;
		let description = null;
		let level = null;
		const $ = body;
		const itemId = getId(url);
		const $typeSelector = $('div.ak-encyclo-block-info').find('div.ak-encyclo-detail-type').find('span');
		if ($typeSelector.html() !== null) {
			type = $typeSelector.text().trim();
		} else {
			const $detailTypeSelector = $('div.ak-encyclo-detail-right').find('div.ak-encyclo-detail-type');

			if ($detailTypeSelector.html()) {
				type = $detailTypeSelector.text().trim().split(':')[1].trim();
			}
		}
		const name = $('h1.ak-return-link').text().trim();
		const $descriptor = $('div.ak-encyclo-detail-right.ak-nocontentpadding').find('div.ak-container.ak-panel').first().find('div.ak-panel-content');
		const $levelSelector = $('div.ak-encyclo-detail-right').find('div.ak-encyclo-detail-level.col-xs-6.text-right');
		if (typeof $descriptor !== 'undefined') description = $descriptor.text().trim(); description = sanatizer(description);
		if (typeof $levelSelector !== 'undefined') level = $levelSelector.text().trim().replace(/\D/g, '');
		const imgUrl = $('div.ak-encyclo-detail-illu').find('img').attr('src').replace('dofus/ng/img/../../../', '');

		const item = {
			_id: null,
			ankamaId: itemId,
			name: name,
			type: type,
			imgUrl: imgUrl,
			url: url
		};
		if ($descriptor.html() !== null) item.description = description;
		if ($levelSelector.html() !== null) item.level = parseInt(level, 10);
		return item;
	};

export function	effectParse(body) {
		const item = [];
		const $ = cheerio.load(body);
		//const reduceElements = $('[class="ak-container ak-panel]').find('div.ak-list-element')
		//console.log(reduceElements)
		$('div.ak-list-element').each(function (i, elt) {
			let groupeElement;
			let stat = $(this).find('div.ak-title').text().trim();
			const statToTest = stat.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

			if (statToTest.includes('title') || statToTest.includes('titre') || statToTest.includes('titulo') || statToTest.includes('attitude') || statToTest.includes('actitud') || statToTest.includes('emote') || statToTest.includes('intercambiable') || statToTest.includes('echangeable') || statToTest.includes('exchangeable') || statToTest.includes('ligado') || statToTest.includes('lie au') || statToTest.includes('linked to')) {
				if (statToTest.includes('title') || statToTest.includes('titre') || statToTest.includes('titulo')) item.push({ 'title': stat.split(':')[1].trim() });
				else if (statToTest.includes('attitude') || statToTest.includes('actitud') || statToTest.includes('emote')) item.push({ 'emote': stat });
				else if (statToTest.includes('echangeable') || statToTest.includes('intercambiable') || statToTest.includes('exchangeable')) item.push({ 'exchangeable': getDate(stat) });
				else if (statToTest.includes('lie au') || statToTest.includes('ligado') || statToTest.includes('linked to')) item.push({ 'linked': true });
			} else {
				stat = $(this).find('div.ak-title').text().trim();
				let element = getElement(stat);
				element = element.charAt(0).toUpperCase() + element.slice(1);
				const numbers = [];
				stat.replace(/(-?\d[\d\.]*)/g, function (x) {
					const n = Number(x); if (x == n) { numbers.push(x); }
				});
				if (typeof numbers[1] == 'undefined') groupeElement = { [element]: { 'min': numbers[0], 'max': null } };
				groupeElement = { [element]: { 'min': numbers[0], 'max': numbers[1] } };
				item.push(groupeElement);
			}
		});

		return item;
	};

export async function statsRequest(url, pageNew) {
	const test = await pageNew.$eval('select.form-control.ak-details-select', () => true).catch(() => false); //Si no hay form de level returna false
		let body;

		if(test){
				await pageNew.select('[class="form-control ak-details-select"]', '100')
				await pageNew.waitForTimeout(1000); //hay que esperar por el cambio de contenido, no he probado con menos
				body = await pageNew.$eval('div.ak-container.ak-panel.ak-item-details-container', (el) => el.innerHTML);
			}else {

				body = await pageNew.$eval('div.ak-container.ak-panel.no-padding', (el) => el.innerHTML);
			}

		/// //// Local initialization ///////
		//const body = await pageNew.$eval('div.ak-container-ak-panel-no-padding', (el) => el.innerHTML);
		//const body = await pageNew.$eval('div.ak-container.ak-panel.ak-item-details-container', (el) => el.innerHTML); //funciona con mascotas con nivel 1-100

		return body;
	}

export function	recipeParse(body) {
		const item = [];
		const $ = body;
		$('div.ak-container.ak-panel.ak-crafts').find('div.ak-panel-content').find('div.ak-container.ak-content-list').find('div.ak-column').each(function (i, element) {
			const setUrl = 'https://www.dofus.com' + $(this).find('div.ak-title').find('a').attr('href');
			const setId = $(this).find('div.ak-title').find('a').attr('href').replace(/\D/g, '');
			const setImage = $(this).find('div.ak-image').find('a').find('span.ak-linker').find('img').attr('src').replace('dofus/ng/img/../../../', '');
			const setQuantity = $(this).find('div.ak-front').text().replace(/\x/g, '').trim();
			const setName = $(this).find('div.ak-content').find('div.ak-title').find('a').find('span.ak-linker').text().trim();
			const setType = $(this).find('div.ak-content').find('div.ak-text').text().trim();
			const setlevel = $(this).find('div.ak-aside').text().replace(/\D/g, '').trim();

			const groupeElement = {
				[setName]: {
					'ankamaId': parseInt(setId, 10),
					'url': setUrl,
					'imgUrl': setImage,
					'type': setType,
					'level': parseInt(setlevel, 10),
					'quantity': parseInt(setQuantity, 10)
				}
			};
			item.push(groupeElement);
		});
		return item;
	};

export function	monsterParse(body, url) {
		let type = null;
		const $ = body;
		const itemId = getId(url);
		const $typeSelector = $('div.ak-encyclo-block-info').find('div.ak-encyclo-detail-type').find('span');
		if ($typeSelector.html() !== null) {
			type = $typeSelector.text().trim();
		} else {
			//console.log($('div.ak-encyclo-detail-right').find('div.ak-encyclo-detail-type').html())
			//console.log(url)
			if( $('div.ak-encyclo-detail-right').find('div.ak-encyclo-detail-type') ){
				//console.log('no tiene tipo')
				type = ''
			}else {
				type = $('div.ak-encyclo-detail-right').find('div.ak-encyclo-detail-type').text().trim().split(':')[1].trim();
			}
		}
		const name = $('h1.ak-return-link').text().trim();
		let imgUrl = $('div.ak-encyclo-detail-illu').find('img').attr('src');
		if (imgUrl == undefined) {
			imgUrl = $('div.ak-encyclo-detail-illu').find('img').attr('data-src');
		}
		if (imgUrl != undefined) {
			imgUrl = imgUrl.replace('dofus/ng/img/../../../', '');
		}
		const monster = {
			_id: null,
			ankamaId: itemId,
			name: name,
			type: type,
			imgUrl: imgUrl,
			url: url
		};
		return monster;
	};

export function	getCategoryType(type) {
		let glType = null;
		switch (true) {
		case /\b(chapeau|hat|sombrero)\b/gi.test(type):
			glType = 'equipments';
			break;
		case /\b(cloak|cape|capa)\b/gi.test(type):
			glType = 'equipments';
			break;
		case /\b(amulet|amulette|amuleto)\b/gi.test(type):
			glType = 'equipments';
			break;
		case /\b(boots|bottes|bota)\b/gi.test(type):
			glType = 'equipments';
			break;
		case /\b(ring|anneau|anillo)\b/gi.test(type):
			glType = 'equipments';
			break;
		case /\b(belt|ceinture|cinturon)\b/gi.test(type):
			glType = 'equipments';
			break;
		case /\b(backpack|sac a dos|mochila)\b/gi.test(type):
			glType = 'equipments';
			break;
		case /\b(shield|bouclier|escudo)\b/gi.test(type):
			glType = 'equipments';
			break;
		case /\b(trophy|trophee|trofeo)\b/gi.test(type):
			glType = 'equipments';
			break;
		case /\b(pet|familier|mascota)\b/gi.test(type):
			glType = 'equipments';
			break;
		case /\bdofus\b/gi.test(type):
			glType = 'equipments';
			break;
		case /\b(objet d'apparat|ceremonial item|objeto de apariencia)\b/gi.test(type):
			glType = 'equipments';
			break;
		case /\b(sword|epee|espada)\b/gi.test(type):
			glType = 'weapons';
			break;
		case /\b(dagger|dague|daga)\b/gi.test(type):
			glType = 'weapons';
			break;
		case /\b(axe|hache|hacha)\b/gi.test(type):
			glType = 'weapons';
			break;
		case /\b(bow|arc|arco)\b/gi.test(type):
			glType = 'weapons';
			break;
		case /\b(hammer|marteau|martillo)\b/gi.test(type):
			glType = 'weapons';
			break;
		case /\b(pickaxe|pioche|pico)\b/gi.test(type):
			glType = 'weapons';
			break;
		case /\b(scythe|faux|guadana)\b/gi.test(type):
			glType = 'weapons';
			break;
		case /\b(shovel|pelle|pala)\b/gi.test(type):
			glType = 'weapons';
			break;
		case /\b(soul stone|pierre d'ame|piedra de alma)\b/gi.test(type):
			glType = 'weapons';
			break;
		case /\b(staff|baton|baston)\b/gi.test(type):
			glType = 'weapons';
			break;
		case /\b(tool|outil|herramienta)\b/gi.test(type):
			glType = 'weapons';
			break;
		case /\b(wand|baguette|varita)\b/gi.test(type):
			glType = 'weapons';
			break;
		default:
			console.log('\x1b[31m%s\x1b[0m', 'Sorry, we are out of ' + type + '.');
		}
		return glType;
	}
