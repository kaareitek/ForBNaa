import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class MyappRoute extends Route {    
    model() {
        console.log(this.store.peekAll("app"))
        return this.store.peekAll("app");
    }
}
