
import {Component,NgZone} from '@angular/core';
import {NavController, Platform, Modal, ViewController} from 'ionic-angular';
import {CluesService} from './cluesService';
import {CongratsModal} from './congratsModal';
import {IBeacon} from 'ionic-native';
//import {ItemsPage} from '../items/items';

declare var evothings:any;


@Component({
    templateUrl: 'build/pages/clues/clues.html',
    providers: [CluesService]
})
export class CluesPage {

    //class variables
    beacons:Object = {};
    public foundBeacons = [];
    items: Array<any>;
    item: Object = {};
    itemsCompleted: Array<any>;
    itemsRemaining: Array<any>;
    clues = [];
    clueTimer = 3000;
    public message;
    zone:NgZone;

    constructor(
        private navController: NavController,
        public viewCtrl: ViewController,
        private cluesService: CluesService,
        platform: Platform
    ) {
        this.zone = new NgZone({enableLongStackTrace: false});
        this.message = 'Scanning for items...';
        platform.ready().then(() => {
            this.startScanning();
        });


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

    startScanning(){
        // start by fetching data on the beacons we're hunting for
        this.getData();


        // Start tracking beacons!

        /* */
// Request permission to use location on iOS
        IBeacon.requestAlwaysAuthorization();
// create a new delegate and register it with the native layer
        let delegate = IBeacon.Delegate();

// Subscribe to some of the delegate's event handlers

        //This event fires every second - looking for beacon signals
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

                    //if beacon has been found, check to see if it matches the beacon we're hunting for
                    if(data.beacons && data.beacons.length > 0){
                        this.matchBeacon(data.beacons);
                    }
                },
                error => console.error
            );
        /*
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
         */


        let beaconRegion = IBeacon.BeaconRegion('deskBeacon','37D34481-3585-45DA-BE7B-381DDD9AE0C7');

        IBeacon.startRangingBeaconsInRegion(beaconRegion)
            .then(
                () => console.log('Native layer recieved the request to monitoring'),
                error => console.error('Native layer failed to begin monitoring: ', error)
            )
        ;


        /* */

    }

    getData(){
        //return this.cluesService.getClues();
        console.log("getting data");
        this.cluesService.getClues().subscribe(
            data => {
                //TODO: return data probably needs a promise
                this.items = data[0]["beacons"];

                //create a copy of all the items. As items are found they will be removed from this array
                this.itemsRemaining = Object.assign([], this.items);

            },
            err => {
                console.log(err);
            },
            () => {
                //complete callback, let's pick a beacon to start with
                this.getItem();
            }
        );
    }

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
        random = 3; //set this to desired number to override random
        //console.log(random);

        //assign the clue data to a variable
        this.item = this.itemsRemaining[random];

        //remove that item from the clues array
        this.itemsRemaining.splice(random,1);

        //start showing the clues for this beacon
        this.showClue();

        console.log("----------------");
        console.log("Item to be found");
        console.log(this.item);

        //testing modal
        //this.zone.run(() => {
            let modalData = {
                item: this.item["item"],
                parent: this.navController["parent"]
            };



        // let modal = Modal.create(CongratsModal,modalData);
        // this.navController.present(modal);
        //this.navController.push(ItemsPage);


        //});
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


    
    matchBeacon(data) {
        for (let i in data) {
            var currentBeacon = this.item["beaconMajor"];

            //match the major numbers, which we're using an unique beacon identifiers
            if (data[i]["major"] == parseInt(currentBeacon)) {
                //show proximity
                this.showProximity(data[i]);
            }
        }
    }

    showProximity(data) {

        //code must run in zone for realtime updates
        let beaconFound = false;
        this.zone.run(() => {
            if (data.accuracy !== -1) {

                let prox = data.proximity;
                this.message = prox;

                if (data.proximity === "ProximityImmediate") {
                    beaconFound = true;
                    let beaconObj = {
                        name: this.item['item'] || 'Unnamed Beacon',
                        distance: (data.accuracy / 3) + ' feet away'
                    };
                    this.foundBeacons[0] = beaconObj;
                    this.message = "Beacon Found!";
                } else {
                    //clear beacon
                    this.foundBeacons = [];
                }
            } else {
                //clear beacon
                this.message = "Scanning for items...";
                this.foundBeacons = [];
            }
        });

        // if beacon proximity is 'ProximityImmediate' then show Congrats Modal to log the findings
        // if(beaconFound) {
        //     let modal = Modal.create(CongratsModal);
        //     this.navController.present(modal);
        // }
    }

}



