import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';

@Component({
  templateUrl: 'build/pages/items/items.html'
})
export class ItemsPage {
  constructor(private navController: NavController) {
  }
}
