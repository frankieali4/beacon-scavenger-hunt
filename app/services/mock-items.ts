import {Item} from '../components/item';


export var ITEMS: Item[] = [
	{ 	id: 1, 
		name: 'Bottle of Sunscreen', 
		clues: [{clue:'For those of Irish descent, this is a summer must-have.', unlocked:true}, {clue:'Before this became a staple of summer, a George Hamilton complexion was en vogue.', unlocked:false}, {clue:'Donald trump looks like he uses this on only parts of his face.', unlocked:false}], 
		found: false,
		ingame: true,
		itemvalue:100,
		currentvalue:100
	},
	{ 	id: 2, 
		name: 'Baseball Hat', 
		clues: [{clue:'Does this lid have a Walmart Logo on it?', unlocked:false}, {clue:'Keep the sun out of your eyes', unlocked:false}, {clue:'Wear this to show your spirit, but you may get hat head', unlocked:false}], 
		found:false,
		ingame: true,
		itemvalue:100,
		currentvalue:100
	},
	{ 	id: 3, 
		name: 'Hot dog', 
		clues: [{clue:'Signature dish of the American pastime', unlocked:false}, {clue:'This baseball game staple is said to have originated in Frankfurt-am-Main, Germany around 1484', unlocked:false}, {clue:'About 155 million of these bad boys are eaten on the fourth of July', unlocked:false}], 
		found:false,
		ingame: true,
		itemvalue:100,
		currentvalue:100
	},
	{ 	id: 4, 
		name: 'Watermelon', 
		clues: [{clue:'This sweet summer fruit is made up mostly of water', unlocked:false}, {clue:'This round summer fruit is actually a vegetable (though people still continue to debate about that fact)', unlocked:false}, {clue:'The heaviest one of these fruits weighed in a 268.6 pounds!', unlocked:false}], 
		found:false,
		ingame: true,
		itemvalue:100,
		currentvalue:100
	}
];
