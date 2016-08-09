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
//declare var evothings:any;

import { Alert, NavController } from 'ionic-angular';
import { CompletePage } from '../complete/complete';
import { Item } from '../../components/item';
import { ItemClueService } from '../../services/itemsclues.service';
import { BeaconService } from '../../services/beacon.service';
import { Clue } from '../../components/clue';
import { Beacon } from '../../components/beacon';

@Component({
  templateUrl: 'build/pages/game/game.html',
  providers: [BeaconService]
})

export class GamePage implements OnInit {
    items:Item[];
    totalScore:number = 0;
    currentTime:number = 0;
    displayTime:string = '0';
    startDate:Date;
    timerInterval:any;
    unlockedBeacons:Object = {};

  	constructor(private nav: NavController, private clueService: ItemClueService, private beaconService:BeaconService) {
      this.beaconService.oBeaconDetected$.subscribe((foundBeacons: Beacon[]) => { 
        console.log('change in service value');
        console.log(foundBeacons);
        this.showTestMessage(foundBeacons);
      });
    }

    getItems(){
      this.clueService.getItemClues().then(items => {
        this.items = items;
        let firstItem = this.items.find(item => item.clues[0].unlocked);
        this.unlockedBeacons[firstItem.beacon.major] = {'itemid':firstItem.id, uuid:firstItem.beacon.uuid};
      });
      
    }
    
    ngOnInit(){
      this.getItems();
      this.startTimer();
      this.beaconService.startScanning();
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
       let zero = sec<10 ? '0' :'';
       return min+':'+zero+Math.floor(sec);
    }

  	toggleItemFound(item:Item){
      //this.beaconService.updateFoundBeacons({uuid:'true'+Math.random(), major:0, minor:0});
      if(!item.found) item.found = !item.found;
      this.drawAttention($('.total-score'));
      setTimeout(() => {
        item.ingame = false;
        if(this.testComplete()) this.completeGame();
      }, 600);
      this.totalScore += item.currentvalue;
    }
    completeGame(){
      if(this.testComplete()) {
        this.alertCompletion(true);
        clearInterval(this.timerInterval);
      }else{
        this.alertCompletion(false);
      }
    }
    testComplete(){
      let itemsNotFound = this.items.filter(function($item){
        return !$item.found;
      });
      if(itemsNotFound.length<1) {
        return true;
      }else{
        return false;
      }
    }

    alertCompletion(allFound:boolean){
      this.doCompletePrompt(allFound);
    }

    unlockClue(item:Item, clue:Clue){
      if(!clue.unlocked) clue.unlocked = !clue.unlocked;
      var lockedclues = item.clues.filter(function($clue){
        return !$clue.unlocked;
      });
      if(!this.unlockedBeacons[item.beacon.major]) this.unlockedBeacons[item.beacon.major] = {'itemid':item.id, uuid:item.beacon.uuid};
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
  	
    doCompletePrompt(allFound:boolean){
      let title = allFound ? 'You\'ve found all the items!' : 'Are you sure you want to end the game?';
      let message = allFound ? 'Enter your full name below to submit your score.' : 'Enter your full name below to submit your current score.';
      let prompt = Alert.create({
        title: title,
        message: message,
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
              this.gotoGameEnd(data);
            }
          }
        ]
      });
      this.nav.present(prompt);
    }

    gotoGameEnd(data){
      clearInterval(this.timerInterval);
      this.clueService.saveCompleteItems(this.items);
      this.clueService.saveScoreSubmission(data.name, data.email, this.totalScore, this.currentTime);
      this.nav.push(CompletePage);
    }

    showTestMessage(beaconsFound){
      let message = '';
      for(let i in beaconsFound){
        let beacon = beaconsFound[i];
        message.concat(message, beacon.uuid + ', major: '+beacon.major+', minor: '+beacon.minor);
      }
      this.nav.present(Alert.create({
        title:'found beacons',
        message:message
      }));
    }
}
