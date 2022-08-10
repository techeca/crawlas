import getEquipments from '../../modules/category-parsers/dofus/parsers/getEquipments.js';
import getClasses from '../../modules/category-parsers/dofus/parsers/getClasses.js';
import getWeapons from '../../modules/category-parsers/dofus/parsers/getWeapons.js';
import getConsumables from '../../modules/category-parsers/dofus/parsers/getConsumables.js';
import getHarnesses from '../../modules/category-parsers/dofus/parsers/getHarnesses.js';
import getHavenBags from '../../modules/category-parsers/dofus/parsers/getHavenBags.js';
import getIdols from '../../modules/category-parsers/dofus/parsers/getIdols.js';
import getMounts from '../../modules/category-parsers/dofus/parsers/getMounts.js';
import getSets from '../../modules/category-parsers/dofus/parsers/getSets.js';
import getPets from '../../modules/category-parsers/dofus/parsers/getPets.js';
import getProfessions from '../../modules/category-parsers/dofus/parsers/getProfessions.js';
import getMonsters from '../../modules/category-parsers/dofus/parsers/getMonsters.js';
import getResources from '../../modules/category-parsers/dofus/parsers/getResources.js';

export default {
	'categories': [
		{
			'key': 'weapons',
			'lang': {
				'fr': 'armes',
				'en': 'weapons',
				'es': 'armas'
			},
			'function': getWeapons
		},
		{
			'key': 'equipments',
			'lang': {
				'fr': 'equipements',
				'en': 'equipment',
				'es': 'equipos'
			},
			'function': getEquipments
		},
		{
			'key': 'sets',
			'lang': {
				'fr': 'panoplies',
				'en': 'sets',
				'es': 'sets'
			},
			'function': getSets
		},
		{
			'key': 'mounts',
			'lang': {
				'fr': 'montures',
				'en': 'mounts',
				'es': 'monturas'
			},
			'function': getMounts
		},
		{
			'key': 'pets',
			'lang': {
				'fr': 'familiers',
				'en': 'pets',
				'es': 'mascotas'
			},
			'function': getPets
		},
		{
			'key': 'resources',
			'lang': {
				'fr': 'ressources',
				'en': 'resources',
				'es': 'recursos'
			},
			'function': getResources
		},
		{
			'key': 'consumables',
			'lang': {
				'fr': 'consommables',
				'en': 'consumables',
				'es': 'consumibles'
			},
			'function': getConsumables
		},
		{
			'key': 'professions',
			'lang': {
				'fr': 'metiers',
				'en': 'professions',
				'es': 'oficios'
			},
			'function': getProfessions
		},
		{
			'key': 'monsters',
			'lang': {
				'fr': 'monstres',
				'en': 'monsters',
				'es': 'monstruos'
			},
			'function': getMonsters
		},
		{
			'key': 'harnesses',
			'lang': {
				'fr': 'harnachements',
				'en': 'harnesses',
				'es': 'arreos'
			},
			'function': getHarnesses
		},
		{
			'key': 'classes',
			'lang': {
				'fr': 'classes',
				'en': 'classes',
				'es': 'clases'
			},
			'function': getClasses
		},
		{
			'key': 'idols',
			'lang': {
				'fr': 'idoles',
				'en': 'idols',
				'es': 'idolos'
			},
			'function': getIdols
		},
		{
			'key': 'havenbags',
			'lang': {
				'fr': 'havres-sacs',
				'en': 'haven-bags',
				'es': 'merkasakos'
			},
			'function': getHavenBags
		}
	]
};
