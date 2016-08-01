import {Injectable} from '@angular/core';
import {ITEMS} from './mock-items';

@Injectable()
export class ItemClueService{
	getItemClues(){
		return Promise.resolve(ITEMS);
	}
	getClue(id:number){
		return this.getItemClues()
			.then(items => items.filter(item => item.id === id)[0]);
	}
}