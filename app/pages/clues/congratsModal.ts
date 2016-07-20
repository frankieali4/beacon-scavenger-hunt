import {Component} from '@angular/core';
import {NavParams, ViewController, NavController, Tabs} from 'ionic-angular';
//import {ItemsService} from '../items/itemsService';
//import {ItemsPage} from '../items/items'

@Component({
    templateUrl: './build/pages/clues/modal.html'
})
export class CongratsModal {
    
    itemName:string;
    parent:Tabs;

    constructor(
        public params: NavParams,
        public viewCtrl: ViewController,
        private nav: NavController
    ) {
        this.itemName = params.data.item;
        this.parent = params.data.parent;

    }

    dismissModal() {

        //dismiss the modal
        this.viewCtrl.dismiss();
        //switch to the items tab
        this.parent.select(1);

        //No idea how to inject data into the tab


    }
}