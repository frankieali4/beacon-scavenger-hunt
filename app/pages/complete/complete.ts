import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';

import {Slides} from 'ionic-angular';
import {ViewChild} from '@angular/core';

@Component({
  templateUrl: 'build/pages/complete/complete.html'
})

export class CompletePage {

  	constructor(private nav: NavController) {}

  	goToOtherPage(){
      //push another page onto the history stack
      //causing the nav controller to animate the new page in
      //this.nav.push(GamePage);
    }
}
