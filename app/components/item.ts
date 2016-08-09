import {Clue} from '../components/clue';
import {Beacon} from '../components/beacon';
export class Item{
	id: number;
	name: string;
	clues:Clue[];
	found:boolean;
	ingame:boolean;
	itemvalue:number;
	currentvalue:number;
	beacon:Beacon;
}
