import {Component} from '@angular/core';
import {NavController, Platform} from 'ionic-angular';
import {CluesService} from './cluesService';

declare var evothings:any;

@Component({
    templateUrl: 'build/pages/clues/clues.html',
    providers: [CluesService]
})
export class CluesPage {

    //class variables
    beacons:Object = {};
    timer:any = null;
    public foundBeacons = [];
    public hasSLBeacon:Boolean = false;
    items: Array<any>;
    item: Object = {};
    itemsCompleted: Array<any>;
    itemsRemaining: Array<any>;
    clues = [];
    clueTimer = 3000;

    constructor(
        private navController: NavController,
        private cluesService: CluesService,
        platform: Platform
    ) {
        platform.ready().then(() => {
            this.startScanning();
        });

    }

    getData(){
        //return this.cluesService.getClues();
        console.log("getting data");
        this.cluesService.getClues().subscribe(
            data => {
                this.items = data[0]["beacons"];

                //create a copy of all the items. As items are found they will be removed from this array
                this.itemsRemaining = Object.assign([], this.items);

            },
            err => {
                console.log(err);
            },
            () => {
                //complete callback
                this.getItem();
            }
        );
    }

    //TODO:
    //pick a beacon at random
    //start delivering clues, one at a time - render clue to page
    //add button for additional clues
    //set a time to deliver clues every few minutes
    //use push notification to deliver clues
    //use push notifications to deliver beacon found message
    //once beacon has been found - click confirmation
    // add found item to items tab
    // add score for that item to the score tab
    // see if badges can be added to tabs to indicate updates


    showMessage(text){
        document.querySelector('#message').innerHTML = text;
    }


    /**
     * Returns a random integer between min (inclusive) and max (exclusive)
     * Using Math.round() will give you a non-uniform distribution!
     */
    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }


    getItem(){
        console.log("here are your item! It's almost too easy");
        //randomly pick a clue from the array
        let random = this.getRandomInt(0,this.itemsRemaining.length);
        console.log(random);

        //assign the clue data to a variable
        this.item = this.itemsRemaining[random];

        //remove that item from the clues array
        this.itemsRemaining.splice(random,1);

        //display the first clue
        this.showClue();

        console.log(this.item);
    }

    showClue(){
        clearTimeout(showNextClue);
        //get next clue
        var newClue = this.item["clues"][0].toString();
        //add it to our data bindings - this will trigger the rendering of the next clue
        this.clues.push(newClue);
        //remove the clue from the item
        this.item["clues"].shift();

        //set timeout for the next clue
        if(this.item["clues"].length > 0){
            var showNextClue = setTimeout(()=>this.showClue(),this.clueTimer);
        }
    }

    startScanning(){
        this.getData();
        this.showMessage('startScanning');
        // Start tracking beacons!
        setTimeout(()=>this.startScan(), 200);
        // Timer that refreshes the display.
        this.timer = setInterval(()=>this.updateBeaconList(), 300);
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
            this.foundBeacons.push(beaconObj);
            console.log(beaconObj);
            if(beaconObj.url == 'http://sarahlamont.com') this.hasSLBeacon = true;
        }

    }
}
