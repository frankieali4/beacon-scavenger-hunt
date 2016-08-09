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
        this.zone.run(() => {
            if (beaconData.accuracy !== -1) {
                if (beaconData.proximity === "ProximityImmediate") {
                    // BEACON IS 'FOUND'
                    // update found beacon array
                    this.updateFoundBeacons({uuid:beaconData.uuid, major:beaconData.major, minor:beaconData.minor});
                }
            }
        });
    }
}