import * as fs from 'fs';
import * as path from 'path';
//import errorHandler from '../services/errorHandler.js';

export function asciiArt(){
console.log('  ██████╗██████╗  █████╗ ██╗    ██╗██╗      █████╗ ███████╗');
console.log(' ██╔════╝██╔══██╗██╔══██╗██║    ██║██║     ██╔══██╗██╔════╝');
console.log(' ██║     ██████╔╝███████║██║ █╗ ██║██║     ███████║███████╗');
console.log(' ██║     ██╔══██╗██╔══██║██║███╗██║██║     ██╔══██║╚════██║');
console.log('  ██████╗██║  ██║██║  ██║╚███╔███╔╝███████╗██║  ██║███████║');
console.log('  ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚══╝╚══╝ ╚══════╝╚═╝  ╚═╝╚══════╝');
}

export function writeFileSync(dist, content, options = {}) {
	dist = path.resolve(dist);
	mkdirSync(path.dirname(dist));
	fs.writeFileSync(dist, content, options);
}

export function mkdirSync(dist, options = {}) {
	dist = path.resolve(dist);
	if (!fs.existsSync(dist)) {
		mkdirSync(path.dirname(dist), options);
		fs.mkdirSync(dist, options);
	}
}

export function getLinksFromFile(itemCategory) {
	//console.log('desde getLinkfrom files')
	//console.log(itemCategory)
	try {
		//const temp = './data/links/' + itemCategory + '_links.json';
		//console.log(temp)
		return JSON.parse(fs.readFileSync('./data/links/' + itemCategory + '_links.json', 'utf8'));
	} catch (error) {
		new errorHandler(error);
	}
}

export function wait(ms) {
	const d = new Date();
	let d2 = null;
	do { d2 = new Date(); }
	while (d2 - d < ms);
}

export function to(promise) {
	return promise.then(data => {
		return [null, data];
	}).catch(err => [err]);
}
