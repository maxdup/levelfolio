import 'angularjs'
import 'angular-route/angular-route'
import 'angular-cookies/angular-cookies'
import 'angular-animate/angular-animate'
import 'angular-ui-bootstrap/dist/ui-bootstrap-tpls'

import 'angular-modal-service/dst/angular-modal-service'

import pageController from './js/controllers.js'
import rootController from './js/root_controller.js'
import localeModule from './js/locale.js'

import navbar from './js/directives/navbar'
import map_viewer from './js/directives/map-viewer'
import map_summary from './js/directives/map-summary'
import map_panorama from './js/directives/map-panorama'

import './less/main.less';
import './less/navbar.less';

angular.module('folioApp', [localeModule, 'ngCookies', 'ngRoute',
                            'ngCookies', 'ngAnimate', 'angularModalService'])
  .directive("navbar", navbar)
  .directive("mapViewer", map_viewer)
  .directive("mapPanorama", map_panorama)
  .directive("mapSummary", map_summary)
  .controller('RootController', rootController)
  .controller('PageController', pageController)
  .controller('ModalController', function($scope, close) {
    return $scope.close = close;
  })
  .config(function($routeProvider, $locationProvider, $compileProvider) {
    "ngInject"

    $routeProvider.when('/', {
      controller: 'PageController',
      template: require('./partials/pages/home.html')
    }).when('/commercial', {
      controller: 'PageController',
      template: require('./partials/pages/commercial.html')
    }).when('/hobby/:map?', {
      controller: 'PageController',
      template: require('./partials/pages/hobby.html')
    }).when('/code', {
      controller: 'PageController',
      template: require('./partials/pages/code.html')
    }).when('/contact', {
      controller: 'PageController',
      template: require('./partials/pages/contact.html')
    }).otherwise({
      redirectTo: '/'
    });
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|steam):/);
    return $locationProvider.html5Mode(true);
  });

