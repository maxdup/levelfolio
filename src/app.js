import 'angularjs'
import '@uirouter/angularjs'
import 'angular-cookies/angular-cookies'
import 'angular-animate/angular-animate'
import 'angular-modal-service/dst/angular-modal-service'
import './js/directives/ui-bootstrap-custom-2.5.0.js'
import pageController from './js/page_controller.js'
import rootController from './js/root_controller.js'
import localeModule from './js/locale.js'

import navbar from './js/directives/navbar'
import popover from './js/directives/popover'
import isotope from './js/directives/isotope'
import map_viewer from './js/directives/map-viewer'
import map_summary from './js/directives/map-summary'
import map_carousel from './js/directives/map-carousel'
import map_panorama from './js/directives/map-panorama'
import modal_image from './js/directives/modal-image'

require('./icons.font');
require('./scss/main.scss');

angular.module('folioApp', ['ui.router', 'ngCookies', 'ngAnimate',
                            localeModule, 'angularModalService',
                            'ui.bootstrap'])
  .config(function($urlRouterProvider, $locationProvider, $stateProvider, $compileProvider){
    "ngInject"
    $stateProvider
      .state('home', {
        url: '/',
        auto: true,
        template: require('./partials/pages/home.html')
      })
      .state('commercial', {
        url: '/commercial',
        controller: 'PageController',
        template: require('./partials/pages/maps.html')
      })
      .state('commercial.id',{
        url: '/:map',
        params: {'map': null}
      })
      .state('hobby',{
        url: '/hobby',
        controller: 'PageController',
        template: require('./partials/pages/maps.html')
      })
      .state('hobby.id',{
        url: '/:map',
        params: {'map': null}
      })
      .state('code',{
        url: '/code',
        auto: true,
        template: require('./partials/pages/code.html')
      })
      .state('contact', {
        url: '/contact',
        auto: true,
        template: require('./partials/pages/contact.html')
      });

    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|steam):/);
    $locationProvider.html5Mode(true);
  })
  .directive("navbar", navbar)
  .directive("popover", popover)
  .directive("isotope", isotope)
  .directive("mapViewer", map_viewer)
  .directive("mapPanorama", map_panorama)
  .directive("mapCarousel", map_carousel)
  .directive("mapSummary", map_summary)
  .directive("modalImage", modal_image)
  .controller('RootController', rootController)
  .controller('PageController', pageController)
