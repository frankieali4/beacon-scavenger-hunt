import {Component} from '@angular/core';
import {JSONP_PROVIDERS} from '@angular/http';
import {Platform, ionicBootstrap} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {SplashPage} from './pages/splash/splash';


@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>'
})
export class MyApp {
  rootPage: any = SplashPage;

  constructor(private platform: Platform) {
    this.platform = platform;
    this.initializeApp();
  }
  
  initializeApp(){
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      //console.log(this.platform.platforms());
    });
  }
}

ionicBootstrap(MyApp,[JSONP_PROVIDERS]);
