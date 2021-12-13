import EmberRouter from '@ember/routing/router';
import config from 'emberjs-lol/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('login');
  this.route('api');
  this.route('main');
  this.route('about');
  this.route('changelog');
  this.route('tut1');
  this.route('tut2');
  this.route('tut3');
  this.route('comm1');
  this.route('comm2');
  this.route('comm3');
  this.route('signup');
  this.route('doc1');
  this.route('doc2');
  this.route('doc3');

  this.route('help');
  this.route('upload');
  this.route('applist');
  this.route('posts');

  this.route('myapp');
  this.route('advanced');
  this.route('permissions');
  this.route('publish');
  this.route('useraccount');
  this.route('options');
});
