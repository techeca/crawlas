import { Item } from './item.model.js';

export default class Profession extends Item {
	constructor(itemProperties, recipes, harvests) {
		super(itemProperties);
		this.recipes = recipes;
		this.harvests = harvests;
	}
}
