import {
  Component,
  OnInit,
  trigger,
  state,
  style,
  transition,
  animate
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
    state:String = "inactive";
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
    }
    unlockClue(clue:Clue){
      if(!clue.unlocked) clue.unlocked = !clue.unlocked;
      //console.log('is unlocked? '+ clue.unlocked);
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
