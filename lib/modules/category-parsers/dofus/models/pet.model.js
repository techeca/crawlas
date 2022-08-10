import { Item } from './item.model.js';

export default class Pet extends Item {
	constructor(itemProperties, statistics, conditions, setId = null) {
		super(itemProperties);
		this.statistics = statistics;
		this.conditions = conditions;
		this.setId = parseInt(setId, 10);
	}
}
