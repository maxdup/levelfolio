import 'angularjs'
import 'angular-route/angular-route'
import 'angular-cookies/angular-cookies'
import 'angular-animate/angular-animate'
import 'angular-ui-bootstrap/dist/ui-bootstrap-tpls'

import controllerModule from './js/controllers.js'
import rootModule from './js/root_controller.js'
import localeModule from './js/locale.js'

import './less/main.less';
angular.module('folioApp', [
  'ngRoute', 'ngCookies', 'ngAnimate', 'ui.bootstrap',
  rootModule, controllerModule, localeModule])

.config(function($routeProvider, $locationProvider, $compileProvider) {
  $routeProvider.when('/', {
    controller: 'FolioController',
    template: require('./partials/pages/home.html')
  }).when('/commercial', {
    controller: 'FolioController',
    template: require('./partials/pages/commercial.html')
  }).when('/hobby/:map?', {
    controller: 'FolioController',
    template: require('./partials/pages/hobby.html')
  }).when('/code', {
    controller: 'FolioController',
    template: require('./partials/pages/code.html')
  }).when('/contact', {
    controller: 'FolioController',
    template: require('./partials/pages/contact.html')
  }).otherwise({
    redirectTo: '/'
  });

  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|steam):/);
  return $locationProvider.html5Mode(true);

});
