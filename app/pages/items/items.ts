import {Component} from '@angular/core';
import {NavController,NavParams} from 'ionic-angular';
import {ItemsService} from "./itemsService";

@Component({
  templateUrl: 'build/pages/items/items.html',
  providers:[ItemsService]
})
export class ItemsPage {
  constructor(
      private navController: NavController,
      public navParams: NavParams,
      public itemsService: ItemsService
  ) {
    //console.log(navParams);
  }
}
