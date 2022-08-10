import { asciiArt, getLinksFromFile } from './services/utils.js';
import { getCategory } from './modules/command-line/cmd.js';
import { parserInit, getPagesLinks, parserProcess } from './modules/global-parser/global-parser.js';
import puppeteer from 'puppeteer';
import errorHandler from './services/errorHandler.js';
import * as fs from 'fs';

//DESPUES DE 4 O 5 SOLICITUdes
//Inicio de app
(async function main() {
  asciiArt();
  const ifResume = fs.existsSync('./data/links/resume.json');
  //console.log(ifResume)
  try {
    //Seleccion de opciones para usuario, idioma, version de dofus, categoria/s a descargar
    let cmdResponse = ifResume === true ? JSON.parse(await getCategory(ifResume)) : JSON.parse(await getCategory(ifResume));    //const cmdResponse = JSON.parse(await getCategory());
    //console.log(cmdResponse)
    if(cmdResponse !== 'yes'){
      parserInit(cmdResponse);
      await puppeteer.launch({ headless: true }) //hasta el momento funciona xD si no poner false (abre chronium)
                     .then( async browser => {
                       //console.log(url)
                       const pageNew = await browser.newPage();
                       //await pageNew.setViewport({ width:1280, height:800 }); //innecesario
                       await pageNew.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64)');  //user agent
                       //await pageNew.goto(url, { waitUntil: ['networkidle2']});
                       //await pageNew.$('tbody').then(console.log(`Recovering data from web `))	//esperamos que tabla de contenido está cargado
                       //return await pageNew.$eval(element, (el) => el.innerHTML).finally(await browser.close());
                       //await pageNew.$eval(element, (el) => el.innerHTML)
                       //Obtención de lista general de items
                       await getPagesLinks(pageNew);
                       //Obtención de detalles de items
                       //console.log('cmdResponse: '+JSON.parse(cmdResponse.category))
                       //console.log(typeof cmdResponse)
                       //if(typeof cmdResponse == 'string'){JSON.parse(cmdResponse)}
                       //console.log('valor de getLinksFromFiles '+JSON.parse(cmdResponse.game))
                       //console.log(cmdResponse.category)
                       const parsingInfo = await parserProcess(cmdResponse.category, getLinksFromFile(cmdResponse.category), cmdResponse.game, pageNew);
                       parsingFinished(parsingInfo);
                       //Fin cerramos browser
                       await browser.close() //no se si se está cerrando solo o se cierra por que se cae
                     }).catch(e => new errorHandler(e));
    } else await resumeLastParse();
    //const parsingInfo = await parserProcess(cmdResponse.category, getLinksFromFile(cmdResponse.category), cmdResponse.game);
    //console.log(parsingInfo)
  } catch (e) {
    new errorHandler(e)
  }
})();

function parsingFinished({ numberItemParsed, categoryName }) {
	console.log('\x1b[32m%s\x1b[0m', '\n SUCCESS : ' + numberItemParsed + ' item(s) were crawled.');
	console.log('\x1b[33m%s\x1b[0m', 'File ' + categoryName + '.json' + ' was generated under "data/" folder.');
	process.exit();
}

async function resumeLastParse() {
	try {
		console.log('\x1b[33m%s\x1b[0m', '/!\\Parsing resumed, let\'s continue the adventure :D');
		const resume = JSON.parse(fs.readFileSync('./data/links/resume.json', 'utf8'));
    console.log('category '+resume.category)
    console.log('links '+resume.category)
    console.log('games '+resume.category)
		const parsingInfo = await parserProcess(resume.category, resume.links, resume.game);
		parsingFinished(parsingInfo);
	} catch (error) {
		new errorHandler(error);
	}
}
