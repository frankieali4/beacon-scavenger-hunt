import {Injectable, NgZone} from '@angular/core';

import {Subject} from 'rxjs/Subject';
import {BehaviorSubject} from "rxjs/Rx";
import {Observable} from 'rxjs/Observable';

import { Beacon } from '../components/beacon';

import {IBeacon} from 'ionic-native';

@Injectable()
export class BeaconService {
    oBeaconDetected$: Observable<Beacon[]>;
	zone:NgZone;

    private boolSubject: Subject<Beacon[]>;
    private arrayBeacons: Beacon[] = [];

    constructor() {
        this.boolSubject = new Subject<Beacon[]>();
        this.oBeaconDetected$ = this.boolSubject.asObservable();
    }

    public startScanning(){
    	// Request permission to use location on iOS
        IBeacon.requestAlwaysAuthorization();
		// create a new delegate and register it with the native layer
        let delegate = IBeacon.Delegate();

		// Subscribe to some of the delegate's event handlers
        //This event fires every second - looking for beacon signals
        delegate.didRangeBeaconsInRegion()
            .subscribe(
                data => {
                	console.log('didRangeBeaconsInRegion');
                	console.log(JSON.stringify(data));
                    //if beacon has been found, check for proximity matches
                    if(data.beacons && data.beacons.length > 0){
                        this.matchBeacon(data.beacons);
                    }
                },
                error => console.error
            );

        let beaconRegion = IBeacon.BeaconRegion('SL','2F234454-CF6D-4A0F-ADF2-F4911BA9FFA6');

		IBeacon.startRangingBeaconsInRegion(beaconRegion)
		  .then(
		    () => console.log('Native layer recieved the request to monitoring'),
		    error => console.error('Native layer failed to begin monitoring: ', error)
		  );
    }

    updateFoundBeacons(beacon:Beacon) {
    	if(this.arrayBeacons.indexOf(beacon) == -1) {
    		this.arrayBeacons.push(beacon);
      		this.boolSubject.next(this.arrayBeacons);
    	}
    }

    matchBeacon(beacons:Object[]) {
    	//[{"minor":0,"rssi":0,"major":4,"proximity":"ProximityUnknown","accuracy":-1,"uuid":"37D34481-3585-45DA-BE7B-381DDD9AE0C7"}]
        for (let i in beacons) {
            this.testProximity(beacons[i]);
        }
    }

    testProximity(beaconData) {
        //code must run in zone for realtime updates
        if (beaconData.accuracy !== -1) {
            if (beaconData.proximity === "ProximityImmediate") {
                // BEACON IS 'FOUND'
                // update found beacon array
                this.updateFoundBeacons({uuid:beaconData.uuid, major:beaconData.major, minor:beaconData.minor});
            }
        }
    }
}