import{Component} from '@angular/core';

@Component({
  templateUrl: 'build/components/item.component.html'
})

export class ItemComponent {
    state:String = "inactive";

  	constructor() {}

  	toggleState(){
      this.state = this.state == 'inactive' ? 'active' : 'inactive';
    }

}
