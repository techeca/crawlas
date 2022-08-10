import inquirer from 'inquirer';
//const inquirer = require('inquirer');
import { firstCategory, equipment, weapon, page, resume } from '../../conf/cliCategories.js'
//const cliCategories = require('../../conf/cliCategories');

export function categoryEquipment(language, game) {
	return inquirer.prompt(equipment).then(answers => {
		answers.language = language;
		answers.game = game;
		return JSON.stringify(answers, null, '  ');
	});
}

export function categoryWeapon(language, game) {
	return inquirer.prompt(weapon).then(answers => {
		answers.language = language;
		answers.game = game;
		return JSON.stringify(answers, null, '  ');
	});
}

export function categorySet(language, game) {
	return inquirer.prompt(page).then(answers => {
		answers.language = language;
		answers.game = game;
		answers.category = 'set';
		return JSON.stringify(answers, null, '  ');
	});
}

export function categoryMount(language, game) {
	return inquirer.prompt(page).then(answers => {
		answers.language = language;
		answers.game = game;
		answers.category = 'mount';
		return JSON.stringify(answers, null, '  ');
	});
}

export function categoryPet(language, game) {
	return inquirer.prompt(page).then(answers => {
		answers.language = language;
		answers.game = game;
		answers.category = 'pet';
		return JSON.stringify(answers, null, '  ');
	});
}

export function categoryResource(language, game) {
	return inquirer.prompt(page).then(answers => {
		answers.language = language;
		answers.game = game;
		answers.category = 'resource';
		return JSON.stringify(answers, null, '  ');
	});
}

export function categoryConsumable(language, game) {
	return inquirer.prompt(page).then(answers => {
		answers.language = language;
		answers.game = game;
		answers.category = 'consumable';
		return JSON.stringify(answers, null, '  ');
	});
}

export function categoryProfession(language, game) {
	return inquirer.prompt(page).then(answers => {
		answers.language = language;
		answers.game = game;
		answers.category = 'profession';
		return JSON.stringify(answers, null, '  ');
	});
}

export function categoryMonster(language, game) {
	return inquirer.prompt(page).then(answers => {
		answers.language = language;
		answers.game = game;
		answers.category = 'monster';
		return JSON.stringify(answers, null, '  ');
	});
}

export function categoryHarness(language, game) {
	return inquirer.prompt(page).then(answers => {
		answers.language = language;
		answers.game = game;
		answers.category = 'harness';
		return JSON.stringify(answers, null, '  ');
	});
}

export function categoryClasse(language, game) {
	return inquirer.prompt(page).then(answers => {
		answers.language = language;
		answers.game = game;
		answers.category = 'classe';
		return JSON.stringify(answers, null, '  ');
	});
}

export function categoryIdol(language, game) {
	return inquirer.prompt(page).then(answers => {
		answers.language = language;
		answers.game = game;
		answers.category = 'idol';
		return JSON.stringify(answers, null, '  ');
	});
}

export function categoryHavenBag(language, game) {
	return inquirer.prompt(page).then(answers => {
		answers.language = language;
		answers.game = game;
		answers.category = 'havenbag';
		return JSON.stringify(answers, null, '  ');
	});
}

//module.exports = { categoryConsumable, categoryEquipment, categoryHarness, categoryMonster, categoryMount, categoryPet, categoryProfession, categoryResource, categorySet, categoryWeapon, categoryClasse, categoryIdol, categoryHavenBag };
