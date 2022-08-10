import { Item } from './item.model.js';

export default class Class extends Item {
	constructor(itemProperties, furnitures, decors, grounds) {
		super(itemProperties);
		this.furnitures = furnitures;
		this.decors = decors;
		this.grounds = grounds;
	}
}
