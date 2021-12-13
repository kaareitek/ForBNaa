import Model from '@ember-data/model';
import DS from 'ember-data';

export default DS.Model.extend({
    developerid: DS.attr(),
    appname: DS.attr('string'),
    logo: DS.attr('string'),
    price: DS.attr(),
    appurl: DS.attr('string')
})
