import {Component} from '@angular/core';
import {NavParams} from "ionic-angular/index";
import {CluesPage} from '../clues/clues';
import {ItemsPage} from '../items/items';
import {ScorePage} from '../score/score';

@Component({
  templateUrl: 'build/pages/tabs/tabs.html'
})
export class TabsPage {

  params:NavParams;

  private clues: any;
  private items: any;
  private score: any;

  beaconParams = {};

  constructor(params:NavParams) {

    // this tells the tabs component which Pages
    // should be each tab's root Page
    this.clues = CluesPage;
    this.items = ItemsPage;
    this.score = ScorePage;

  }
}
