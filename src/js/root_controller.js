var THREE = require('three');
const rootModule = 'folio.RootController';
export default rootModule;

import map_viewer from './directives/map-viewer'
import map_summary from './directives/map-summary'
import map_panorama from './directives/map-panorama'
import maps from './maps_meta.js';

angular.module(rootModule, ['ui.bootstrap', 'ngCookies'])
  .controller('RootController', function(
    $scope, $location, $http, $route, $routeParams, $rootScope, $window,
    $cookies, $timeout, $translate, $templateCache) {

    var  hidecontrols, isUserInteracting, lat, lon, material,
        mesh, onDocumentMouseDown, onDocumentMouseMove, onDocumentMouseUp,
        onDocumentMouseWheel, onMouseDownLat, onMouseDownLon, onPointerDownLat,
        onPointerDownLon, onPointerDownPointerX, onPointerDownPointerY, phi,
        renderer, routes, scene, theta, w;

    $scope.translate = function(lang) {
      $scope.active_lang = lang;
      $translate.use(lang);
      return $cookies.put('lang', lang);
    };
    if ($cookies.get('lang')) {
      $scope.translate($cookies.get('lang'));
    } else {
      $scope.active_lang = $translate.use();
    }
    angular.element(document.querySelector('.content'))
      .bind('mousewheel', function(event, delta){
        this.scrollLeft += event.originalEvent.deltaY;
        event.preventDefault();
      });

    $templateCache.put('nav', require('../partials/nav.html'));

    $templateCache.put('vanguard', require('../partials/maps/vanguard.html'));
    $templateCache.put('effigy', require('../partials/maps/effigy.html'));
    $templateCache.put('occult', require('../partials/maps/occult.html'));
    $templateCache.put('hadal', require('../partials/maps/hadal.html'));

    $scope.maps = maps;

    $scope.current_panorama = maps['vanguard'];
    $scope.go_panorama = function(map) {
      $rootScope.focus360 = true;
      if (map){ $scope.current_map = map; }
    }

    $scope.queue = function() {
      var front, k, v, _ref;
      front = {};
      $scope.mapsQueue = [];
      _ref = $scope.maps;
      for (k in _ref) {
        v = _ref[k];
        if (v['level'] === 0) {
          if (k === $routeParams.map) {
            front = v;
          } else {
            $scope.mapsQueue.push(v);
          }
        }
      }
      $scope.mapsQueue.sort(function(a, b) {
        return a['order'] - b['order'];
      });
      if (front) {
        return $scope.mapsQueue.unshift(front);
      }
    };
    routes = ["/home", "/commercial", "/hobby/:map?", "/code", "/contact"];
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
      var k, v, _ref;
      $scope.isNavCollapsed = true;
      if (!current || !current['$$route']) {
        return;
      }
      _ref = $scope.maps;
      for (k in _ref) {
        v = _ref[k];
        v['mdlshow'] = false;
      }
      return $scope.reverse = routes.indexOf(current['$$route']['originalPath']) > routes.indexOf(next['$$route']['originalPath']);
    });
    $scope.isActive = function(viewLocation) {
      return $location.path().indexOf(viewLocation) === 0;
    };
  })
  .directive("mapViewer", map_viewer)
  .directive("mapPanorama", map_panorama)
  .directive("mapSummary", map_summary)
  .controller('ModalController', function($scope, close) {
    return $scope.close = close;
  });


