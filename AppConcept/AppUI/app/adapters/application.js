import DS from 'ember-data';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ApplicationAdapter extends DS.RESTAdapter {
    @service session;

    host = "http://localhost:3000";
    authorizer = "authorizer:application";

    @computed('session.data.authenticated.access_token')
    get headers() {
        let headers = {};
        if (this.session.isAuthenticated) {
            headers['Authorization'] = `Bearer ${this.session.data.authenticated.access_token}`;
        }

        return headers;     
    }
};