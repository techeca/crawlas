import { Item } from './item.model.js';

export default class Mount extends Item {
	constructor(itemProperties, statistics, characteristics, conditions, recipe) {
		super(itemProperties);
		this.statistics = statistics;
		this.characteristics = characteristics;
		this.conditions = conditions;
		this.recipe = recipe;
	}
}
