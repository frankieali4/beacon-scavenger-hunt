/// <reference path="../../../typings/node/lodash-3.10.d.ts" />
/// <reference path="../../../typings/node/text-encoding.d.ts" />
import {Component} from '@angular/core';
import {NavController, Platform} from 'ionic-angular';
import {CluesService} from './cluesService';
import {IBeacon} from 'ionic-native';
//import escape  = require('../../../node_modules/lodash');
import * as lodash from "lodash";
import * as textEncoding from "text-encoding";

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
    message = 'Preparing...';

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



    /**
     * Returns a random integer between min (inclusive) and max (exclusive)
     * Using Math.round() will give you a non-uniform distribution!
     */
    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }


    getItem(){
        //console.log("here are your item! It's almost too easy");
        //randomly pick a clue from the array
        let random = this.getRandomInt(0,this.itemsRemaining.length);
        console.log(random);

        //assign the clue data to a variable
        this.item = this.itemsRemaining[random];

        //remove that item from the clues array
        this.itemsRemaining.splice(random,1);

        //display the first clue
        this.showClue();

        //console.log(this.item);
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
        this.message = 'Starting Scan';
        // Start tracking beacons!
        //setTimeout(()=>this.startScan(), 1000);
        // Timer that refreshes the display.
        //this.timer = setInterval(()=>this.updateBeaconList(), 1000);

/* */
// Request permission to use location on iOS
        IBeacon.requestAlwaysAuthorization();
// create a new delegate and register it with the native layer
        let delegate = IBeacon.Delegate();

// Subscribe to some of the delegate's event handlers
        delegate.didRangeBeaconsInRegion()
            .subscribe(
                data => {
                    console.log("------------------------");
                    console.log('didRangeBeaconsInRegion');
                    console.log(data);
                    // Sample Results
                    // No Beacons:                   {"region":{"typeName":"BeaconRegion","uuid":"37D34481-3585-45DA-BE7B-381DDD9AE0C7","identifier":"deskBeacon"},"eventType":"didDetermineStateForRegion","state":"CLRegionStateInside"}
                    // Beacon On:                    {"region":{"typeName":"BeaconRegion","uuid":"37D34481-3585-45DA-BE7B-381DDD9AE0C7","identifier":"deskBeacon"},"eventType":"didRangeBeaconsInRegion","beacons":[{"minor":0,"rssi":-61,"major":4,"proximity":"ProximityNear","accuracy":0.6,"uuid":"37D34481-3585-45DA-BE7B-381DDD9AE0C7"}]}
                    // Beacon On - Not Transmitting: {"region":{"typeName":"BeaconRegion","uuid":"37D34481-3585-45DA-BE7B-381DDD9AE0C7","identifier":"deskBeacon"},"eventType":"didRangeBeaconsInRegion","beacons":[{"minor":0,"rssi":0,"major":4,"proximity":"ProximityUnknown","accuracy":-1,"uuid":"37D34481-3585-45DA-BE7B-381DDD9AE0C7"}]}
                    // Multiple Beacons:             {"region":{"typeName":"BeaconRegion","uuid":"37D34481-3585-45DA-BE7B-381DDD9AE0C7","identifier":"deskBeacon"},"eventType":"didRangeBeaconsInRegion","beacons":[{"minor":0,"rssi":-53,"major":5,"proximity":"ProximityNear","accuracy":0.49,"uuid":"37D34481-3585-45DA-BE7B-381DDD9AE0C7"},{"minor":0,"rssi":-77,"major":4,"proximity":"ProximityFar","accuracy":2.02,"uuid":"37D34481-3585-45DA-BE7B-381DDD9AE0C7"}]}
                },
                error => console.error
            );
        delegate.didStartMonitoringForRegion()
            .subscribe(
                data => {
                    console.log("---------------------------");
                    console.log('didStartMonitoringForRegion');
                    console.log(data);
                },
                error => console.error
            );
        delegate.didEnterRegion()
            .subscribe(
                data => {
                    console.log("--------------");
                    console.log('didEnterRegion');
                    console.log(data);
                }
            );
        delegate.didDetermineStateForRegion()
            .subscribe(
                data => {
                    console.log('--------------------------');
                    console.log('didDetermineStateForRegion');
                    console.log(data);
                }

            );


        let beaconRegion = IBeacon.BeaconRegion('deskBeacon','37D34481-3585-45DA-BE7B-381DDD9AE0C7');

        IBeacon.startRangingBeaconsInRegion(beaconRegion)
            .then(
                () => console.log('Native layer recieved the request to monitoring'),
                error => console.error('Native layer failed to begin monitoring: ', error)
            )
        ;


/* */

    }

    /*
    startScan(){
        var self:any = this;
        this.message = 'Scan in progress.';
        this.beacons = [], this.foundBeacons = [];
        evothings.eddystone.startScan(beacon => this.updateBeaconData(beacon),
            error => this.message = 'eddystone scan error ' + error)
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
            // Only show beacons updated during the last 4 seconds.
            var beacon = this.beacons[key];
            if (beacon.timeStamp + 4000 < timeNow){
                delete this.beacons[key];
            }
        }
    }

    displayBeacons(){
        this.foundBeacons = [];
        this.hasSLBeacon = false;
        for (var key in this.beacons){
            let beacon = this.beacons[key];
            //console.log(this.beacons[key]);
            console.log("==================");
            console.log("ecmascript decoder");
            var decode = decodeURIComponent(lodash.escape(String.fromCharCode.apply(null, new Uint8Array(beacon.nid))));
            console.log("beacon");
            console.log(JSON.stringify(beacon));
            console.log("==================");
            console.log(decode);
            console.log("TextDecoder");
            console.log(TextDecoder);
            var nameSpace = new textEncoding.TextDecoder("utf-8").decode(beacon.nid);
            var instance = new textEncoding.TextDecoder("utf-8").decode(beacon.bid);
            console.log("namespace: " + nameSpace);
            console.log("instance: " + instance);
            console.log("------------------");
            let beaconObj = {
                name:beacon.name || 'Unnamed Beacon',
                url:beacon.url || 'No URL for this Beacon',
                nid:nameSpace || 'No NID for this Beacon',
                bid:instance || 'No BID for this Beacon',
                distance: Math.floor(evothings.eddystone.calculateAccuracy(
                    beacon.txPower, beacon.rssi))
            };
            this.foundBeacons.push(beaconObj);
            //console.log(beaconObj);
            if(beaconObj.url == 'http://sarahlamont.com') this.hasSLBeacon = true;
        }

    }
    */
}
