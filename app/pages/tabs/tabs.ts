import {Component} from '@angular/core';
import {CluesPage} from '../clues/clues';
import {ItemsPage} from '../items/items';
import {ScorePage} from '../score/score';

@Component({
  templateUrl: 'build/pages/tabs/tabs.html'
})
export class TabsPage {

  private clues: any;
  private items: any;
  private score: any;

  constructor() {
    // this tells the tabs component which Pages
    // should be each tab's root Page
    this.clues = CluesPage;
    this.items = ItemsPage;
    this.score = ScorePage;
    
  }
}
