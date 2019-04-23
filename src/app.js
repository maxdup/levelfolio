import 'angularjs'
import '@uirouter/angularjs'
import 'angular-cookies/angular-cookies'
import 'angular-animate/angular-animate'
import 'angular-ui-bootstrap/dist/ui-bootstrap-tpls'

import 'angular-modal-service/dst/angular-modal-service'

import pageController from './js/page_controller.js'
import rootController from './js/root_controller.js'
import localeModule from './js/locale.js'

import navbar from './js/directives/navbar'
import map_viewer from './js/directives/map-viewer'
import map_summary from './js/directives/map-summary'
import map_panorama from './js/directives/map-panorama'

import './less/main.less';
import './less/navbar.less';

angular.module('folioApp', ['ui.router', localeModule, 'ngCookies',
                            'ngCookies', 'ngAnimate', 'angularModalService'])
  .config(function($urlRouterProvider, $locationProvider, $stateProvider, $compileProvider){
    "ngInject"
    $stateProvider
      .state('home', {
        url: '/',
        auto: true,
        controller: 'PageController',
        template: require('./partials/pages/home.html')
      })
      .state('commercial', {
        url: '/commercial',
        controller: 'PageController',
        template: require('./partials/pages/commercial.html')
      })
      .state('hobby',{
        url: '/hobby',
        controller: 'PageController',
        template: require('./partials/pages/hobby.html')
      })
      .state('code',{
        url: '/code',
        auto: true,
        controller: 'PageController',
        template: require('./partials/pages/code.html')
      })
      .state('contact', {
        url: '/contact',
        auto: true,
        controller: 'PageController',
        template: require('./partials/pages/contact.html')
      });

    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|steam):/);
    $locationProvider.html5Mode(true);
  })
  .directive("navbar", navbar)
  .directive("mapViewer", map_viewer)
  .directive("mapPanorama", map_panorama)
  .directive("mapSummary", map_summary)
  .controller('RootController', rootController)
  .controller('PageController', pageController)
  .controller('ModalController', function($scope, close) {
    return $scope.close = close;
  })

