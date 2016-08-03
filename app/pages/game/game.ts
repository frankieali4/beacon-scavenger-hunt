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

declare var $:any;

import { Alert, NavController } from 'ionic-angular';
import { CompletePage } from '../complete/complete';
import { Item } from '../../components/item';
import { ItemClueService } from '../../services/itemsclues.service';
import {Clue} from '../../components/clue';

@Component({
  templateUrl: 'build/pages/game/game.html'
})

export class GamePage implements OnInit {
    items:Item[];
    totalScore:number = 0;
    currentTime:number = 0;
    displayTime:string = '0';
    startDate:Date;
    timerInterval:any;

  	constructor(private nav: NavController, private clueService: ItemClueService) {}

    getItems(){
      this.clueService.getItemClues().then(items => this.items = items);
    }
    
    ngOnInit(){
      this.getItems();
      this.startTimer();
    }

    startTimer(){
      this.startDate = new Date();
      this.timerInterval = setInterval(()=>{
        let end = new Date();
        this.currentTime = end.getTime() - this.startDate.getTime();
        this.displayTime = this.convertMS(this.currentTime);
        //console.log(this.displayTime);
      }, 500);
    }

    convertMS(ms:number){
       let min = (ms/1000/60) << 0,
       sec = (ms/1000) % 60;
       return min+':'+Math.floor(sec);
    }

  	toggleItemFound(item:Item){
      if(!item.found) item.found = !item.found;
      this.drawAttention($('.total-score'));
      setTimeout(() => {
        item.ingame = false;
        this.testComplete();
      }, 600);
      this.totalScore += item.currentvalue;
      
    }
    testComplete(){
      let itemsNotFound = this.items.filter(function($item){
        return !$item.found;
      });
      if(itemsNotFound.length<1) this.alertCompletion();
    }

    alertCompletion(){
      clearInterval(this.timerInterval);
      this.doPromptComplete();
      //console.log('you\'ve found them all');
    }

    unlockClue(item:Item, clue:Clue){
      if(!clue.unlocked) clue.unlocked = !clue.unlocked;
      var lockedclues = item.clues.filter(function($clue){
        return !$clue.unlocked;
      });
      var cluevalue = Math.round(item.itemvalue / item.clues.length);
      if(lockedclues.length < item.clues.length-1) {
        item.currentvalue = (lockedclues.length+1) * cluevalue;
        var $alertScore = $('#item'+item.id+' .current-value');
        this.drawAttention($alertScore);
      };      
    }

    drawAttention(el:any){
      el.addClass('changed');
        setTimeout(() => {
          el.removeClass('changed');
        }, 1000);
    }

    hideItem(item:Item){
      this.items = this.items.filter(function( $item ) {
        return $item.id !== item.id;
      });
    }
  	
    doPromptComplete() {
      let prompt = Alert.create({
        title: 'You\'ve found all the items!',
        message: 'Enter your full name below to submit your score.',
        inputs: [
          {
            name: 'name',
            placeholder: 'Name'
          },
        ],
        buttons: [
          {
            text: 'Cancel',
            handler: data => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Save',
            handler: data => {
              this.gotoGameEnd();
            }
          }
        ]
      });
      this.nav.present(prompt);
    }
    doPromptIncomplete() {
      let prompt = Alert.create({
        title: 'Are you sure you want to end the game?',
        message: 'Enter your full name below to submit your current score.',
        inputs: [
          {
            name: 'name',
            placeholder: 'Name'
          },
        ],
        buttons: [
          {
            text: 'Cancel',
            handler: data => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Save',
            handler: data => {
              this.gotoGameEnd();
            }
          }
        ]
      });
      this.nav.present(prompt);
    }
    gotoGameEnd(){
      clearInterval(this.timerInterval);
      this.nav.push(CompletePage);
    }
}
