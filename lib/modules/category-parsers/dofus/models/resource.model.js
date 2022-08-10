import { Item } from './item.model.js';

export default class Resource extends Item {
	constructor(itemProperties, recipe) {
		super(itemProperties);
		this.recipe = recipe;
	}
}
