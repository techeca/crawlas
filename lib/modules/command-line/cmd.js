import { categoryEquipment, categoryWeapon, categorySet, categoryMount, categoryPet, categoryResource,  categoryConsumable, categoryProfession, categoryMonster, categoryHarness, categoryClasse, categoryIdol, categoryHavenBag} from './modules/interactive-shell/inquirer.js';
//const inq = require('./modules/interactive-shell/inquirer');
import inquirer from 'inquirer';
import { getAnswersFromCommand } from './modules/command-line/commander.js';
import * as fs from 'fs';
import { firstCategory, equipment, weapon, page, resume } from './conf/cliCategories.js';

let language = 'spanish';
let game = 'dofus';

export function getCategory(ifResume){
  if(ifResume) {
    return inquirer.prompt(resume)
           .then(answers => {
             if(answers.resume === 'yes') {
               return answers.resume;
             }
             else {
               fs.unlinkSync('./data/links/resume.json');
               return getCategory(false);
             }
           });
     } else {
        return getAnswersFromCommand(firstCategory, page, weapon, equipment) || inquirer.prompt(firstCategory)
               .then(answers => {
                 language = answers.language;
                 game = answers.game;
                 return switchCategory(answers.category);
          });
     }
}

function switchCategory(category) {
	switch (category) {
	case 'equipment':
		return categoryEquipment(language, game);
	case 'weapon':
		return categoryWeapon(language, game);
	case 'set':
		return categorySet(language, game);
	case 'mount':
		return categoryMount(language, game);
	case 'pet':
		return categoryPet(language, game);
	case 'resource':
		return categoryResource(language, game);
	case 'consumable':
		return categoryConsumable(language, game);
	case 'profession':
		return categoryProfession(language, game);
	case 'monster':
		return categoryMonster(language, game);
	case 'harness':
		return categoryHarness(language, game);
	case 'classe':
		return categoryClasse(language, game);
	case 'idol':
		return categoryIdol(language, game);
	case 'havenbag':
		return categoryHavenBag(language, game);
	default:
		console.log('Sorry, we are out of ' + category + '.');
	}
}

//module.exports = { getCategory };
