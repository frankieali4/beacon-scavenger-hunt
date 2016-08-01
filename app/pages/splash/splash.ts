import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {TabsPage} from '../tabs/tabs';
import {GamePage} from '../game/game';

import {Slides} from 'ionic-angular';
import {ViewChild} from '@angular/core';

@Component({
  templateUrl: 'build/pages/splash/splash.html'
})

export class SplashPage {
	introSlideOptions = {
	    pager:true
	};
	@ViewChild('introSlider') slider: Slides;

  	constructor(private nav: NavController) {}

  	goToEnd() {
	    this.slider.slideTo(this.slider.length(), 800);
	  }

  	goToOtherPage(){
      //push another page onto the history stack
      //causing the nav controller to animate the new page in
      this.nav.push(GamePage);
    }
}
