import {Jsonp} from '@angular/http';
import 'rxjs/add/operator/map';

export class CluesService{
    // static get parameters() {
    //     return [[Http]];
    // }

    static get parameters() {
        return [[Jsonp]];
    }

    // constructor(private http:Http){
    // }
    constructor(private jsonp:Jsonp){
    }

    getClues() {
        var url = 'http://frank-designs.com/clients/sgs-beacon-hunt/beaconData.json?callback=JSONP_CALLBACK';
        //var response = this.http.get(url).map(res => res.json());
        // var response = this.http.get(url);
        return this.jsonp.request(url).map(res => res.json());
    }
}