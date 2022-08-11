import { Item } from './item.model.js';

export default class Mount extends Item {
	constructor(itemProperties, statistics, characteristics, howGet, cross) {
		super(itemProperties);
		this.statistics = statistics;
		this.characteristics = characteristics;
		this.howGet = howGet;
		this.cross = cross;
	}
}
