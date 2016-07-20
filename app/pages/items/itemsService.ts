export class ItemsService {

    items: Array<any>;

    constructor() {
        //this.items = [];
    }

    addItem(itemName) {
        this.items.push(itemName);
    }
}