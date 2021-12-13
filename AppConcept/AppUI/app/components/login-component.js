import Ember from 'ember';

export default Ember.Component.extend({
    router: Ember.inject.service(),
    authManager: Ember.inject.service('session'),

    actions: {
        authenticate() {
            const { username, password } = this.getProperties('username', 'password');
            this.get('authManager').authenticate('authenticator:oauth2', username, password).then(() => {
                this.get('router').transitionTo('index');
                
            }), (err) => {
                alert('Error obtaining token: ' + err.responseText);
            };
        }
    }
});