/// <reference path="../../../typings/cordova/cordova-plugin-email-composer.d.ts"/>
import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';

@Component({
  templateUrl: 'build/pages/score/score.html'
})
export class ScorePage {
  constructor(private navController: NavController) {
  }
  
 sendEmail(eAddress: string, eSubject: string, eContent: string){
 	eAddress = "mfitz@mac.com";
 	eSubject = "My score from the game";
 	eContent = "Here is where the score stuff goes";
 	
 	console.log('sendEmail called');
 	
 	cordova.plugins.email.open({
		to:      [eAddress],
		cc:      [''],
		bcc:     [''],
		subject: eSubject,
		body:    eContent
	});
	
 	
 }
  
}
