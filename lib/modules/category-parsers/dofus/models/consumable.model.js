import { Item } from './item.model.js';

export default class Consumable extends Item {
	constructor(itemProperties, statistics, conditions, recipe) {
		super(itemProperties);
		this.statistics = statistics;
		this.conditions = conditions;
		this.recipe = recipe;
	}
}
