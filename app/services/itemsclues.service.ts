import {Injectable} from '@angular/core';
import {ITEMS} from './mock-items';
import {Item} from '../components/item';
import {Score} from '../components/score';

@Injectable()
export class ItemClueService{
	completeItems:Item[];
	finalScoreSubmission:Score = {
		name:'Default',
		email:'none',
		score:0,
		time:0,
		submitted:false
	};

	getItemClues(){
		return Promise.resolve(ITEMS);
	}
	getItem(id:number){
		return this.getItemClues()
			.then(items => items.filter(item => item.id === id)[0]);
	}
	saveCompleteItems(items:Item[]){
		this.completeItems = items;
	}
	getCompleteItems(){
		return this.completeItems;
	}
	saveScoreSubmission(name:string = 'Default', email:string, score:number, time:number){
		this.finalScoreSubmission.name = name;
		this.finalScoreSubmission.email = email;
		this.finalScoreSubmission.score = score;
		this.finalScoreSubmission.time = time;
	}
	getScoreSubmission(){
		return this.finalScoreSubmission;
	}
}