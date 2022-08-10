import { Item } from './item.model.js';

export default class Equipment extends Item {
	constructor(itemProperties, statistics, conditions, recipe, setId = null) {
		super(itemProperties);
		this.statistics = statistics;
		this.conditions = conditions;
		this.recipe = recipe;
		this.setId = parseInt(setId, 10);
	}
}
