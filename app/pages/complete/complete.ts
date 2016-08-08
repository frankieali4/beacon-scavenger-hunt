import {Component, OnInit} from '@angular/core';
import {NavController} from 'ionic-angular';

import {Slides} from 'ionic-angular';
import {ViewChild} from '@angular/core';
import { Item } from '../../components/item';
import { ItemClueService } from '../../services/itemsclues.service';
import {Score} from '../../components/score';

@Component({
  templateUrl: 'build/pages/complete/complete.html'
})

export class CompletePage {
    finalItems:Item[];
    amountFound:number;
    finalScoreInfo:Score;
    finalDisplayTime:string;

  	constructor(private nav: NavController, private clueService: ItemClueService) {}

  	getFinalScore(){
      this.finalItems = this.clueService.getCompleteItems();
      this.amountFound = this.finalItems.filter(function($item){
        return $item.found;
      }).length;
      //console.log(this.finalItems);
      this.finalScoreInfo = this.clueService.getScoreSubmission();

      let min = (this.finalScoreInfo.time/1000/60) << 0,
       sec = (this.finalScoreInfo.time/1000) % 60;

      this.finalDisplayTime = min+':'+Math.floor(sec);
      console.log(this.finalScoreInfo);
    }
    
    ngOnInit(){
      this.getFinalScore();
    }
}
