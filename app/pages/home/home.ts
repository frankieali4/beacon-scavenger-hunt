import {Component} from "@angular/core";
import {NavController} from 'ionic-angular';
import {Platform, ionicBootstrap} from 'ionic-angular';

declare var evothings:any;

@Component({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {
	beacons:Object = {};
	timer:any = null;
	public foundBeacons = [];
    public hasSLBeacon:Boolean = false;

  	constructor(private navController: NavController, platform: Platform) {
		platform.ready().then(() => {
      		this.startScanning();
    	});
  	}
  	showMessage(text){
        document.querySelector('#message').innerHTML = text;
    }

  	startScanning(){
        this.showMessage('startScanning');
        // Start tracking beacons!
        setTimeout(()=>this.startScan(), 500);
        // Timer that refreshes the display.
        this.timer = setInterval(()=>this.updateBeaconList(), 1000);
    }

    startScan(){
    	var self:any = this;
        this.showMessage('Scan in progress.');
        this.beacons = [], this.foundBeacons = [];
        evothings.eddystone.startScan(beacon => this.updateBeaconData(beacon),
            error => this.showMessage('eddyston scan error '+error));
    }

    updateBeaconData(beaconData:any){
        beaconData.timeStamp = Date.now();
        this.beacons[beaconData.address] = beaconData;
    }

    updateBeaconList(){
        this.removeOldBeacons();
        this.displayBeacons();
    }

    removeOldBeacons(){
        var timeNow = Date.now();
        for (var key in this.beacons){
            // Only show beacons updated during the last 60 seconds.
            var beacon = this.beacons[key];
            if (beacon.timeStamp + 60000 < timeNow){
                delete this.beacons[key];
            }
        }
    }

    displayBeacons(){
        var html = '';
        this.foundBeacons = [];
        this.hasSLBeacon = false;
        for (var key in this.beacons){
            let beacon = this.beacons[key];
            let beaconObj = {
            	name:beacon.name || 'Unnamed Beacon',
            	url:beacon.url || 'No URL for this Beacon',
				distance: Math.floor(evothings.eddystone.calculateAccuracy(
    				beacon.txPower, beacon.rssi))
            };
            // let htmlBeacon =
            //     '<p>'
            //     +   this.htmlBeaconName(beacon)
            //     +   this.htmlBeaconURL(beacon)
            //     + '</p>';
            // html += htmlBeacon
            this.foundBeacons.push(beaconObj);
            if(beaconObj.url == 'http://sarahlamont.com') this.hasSLBeacon = true;
        }

        //document.querySelector('#found-beacons').innerHTML = html;
    }

    mapBeaconRSSI(rssi){
        if (rssi >= 0) return 1; // Unknown RSSI maps to 1.
        if (rssi < -100) return 100; // Max RSSI
        return 100 + rssi;
    }

    htmlBeaconName(beacon){
        var name = beacon.name || 'no name';
        return '<strong>' + name + '</strong><br/>';
    }

    htmlBeaconURL(beacon){
        return beacon.url ?
            'URL: ' + beacon.url + '<br/>' :  '';
    }
}