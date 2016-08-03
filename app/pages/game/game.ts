import {
  Component,
  OnInit,
  trigger,
  state,
  style,
  transition,
  animate,
  keyframes
} from '@angular/core';

import {NavController} from 'ionic-angular';
import {ScorePage} from '../score/score';
import { Item } from '../../components/item';
import { ItemClueService } from '../../services/itemsclues.service';
import {Clue} from '../../components/clue';

@Component({
  templateUrl: 'build/pages/game/game.html'
})

export class GamePage implements OnInit {
    items:Item[];

  	constructor(private nav: NavController, private clueService: ItemClueService) {}

    getItems(){
      this.clueService.getItemClues().then(items => this.items = items);
    }
    
    ngOnInit(){
      this.getItems();
    }

  	toggleItem(item:Item){
      if(!item.found) item.found = !item.found;
      //console.log('this state = '+this.state);
      setTimeout(() => {
        item.ingame = false;
      }, 600);
    }
    unlockClue(item:Item, clue:Clue){
      if(!clue.unlocked) clue.unlocked = !clue.unlocked;
      var lockedclues = item.clues.filter(function($clue){
        return !$clue.unlocked;
      });
      var cluevalue = Math.round(item.itemvalue / item.clues.length);
      if(lockedclues.length < item.clues.length-1) item.currentvalue = (lockedclues.length+1) * cluevalue;
    }
    hideItem(item:Item){
      this.items = this.items.filter(function( $item ) {
        return $item.id !== item.id;
      });
    }
  	goToOtherPage(){
      //push another page onto the history stack
      //causing the nav controller to animate the new page in
      this.nav.push(ScorePage);
    }
}
