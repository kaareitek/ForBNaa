import Ember from 'ember';

export default Ember.Component.extend({
    router: Ember.inject.service(),
    store: Ember.inject.service(),
    session: Ember.inject.service(),
    
    actions: {
        createApp() {
            // get the input value from the .hbs template
            let name = this.get('appname');
            let url = this.get('appurl');

            let logoImg;

            if(this.get('image')){
                logoImg = this.get('image');
            }

            // create a record in Ember Data (locally, would not survive page refresh)
            let newRecord = this.get('store').createRecord('app', {
              appname: name,
              appurl: url,
              developerid: this.get('session.data.authenticated.id'),
              logo: logoImg
            })

            // Save the record to the API endpoint specified in adapters/application.js
            newRecord.save();
            this.get('router').transitionTo('applist');
        },

        saveImage() {
            let reader = new FileReader();
            let self = this;
            let fileInput = Ember.$("#default-btn")[0];
            let image = fileInput.files[0];
            let imageData;
            
            reader.onload = function(){
                imageData = reader.result;
                self.set('image', imageData);
            };

            if (image) {
                reader.readAsDataURL(image);
            }
        }
    }
});