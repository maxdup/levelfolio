var THREE = require('three');
const rootModule = 'folio.RootController';
export default rootModule;

import maps from './maps_meta.js';

angular.module(rootModule, ['ui.bootstrap', 'ngCookies'])
  .controller('RootController', function(
    $scope, $location, $http, $route, $routeParams, $rootScope, $window,
    $cookies, $timeout, $translate, $templateCache) {

    var camera, currmap, hidecontrols, isUserInteracting, lat, lon, material,
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

    camera = null;
    scene = null;
    renderer = null;
    mesh = null;
    material = null;
    isUserInteracting = false;
    onPointerDownPointerX = 0;
    onPointerDownPointerY = 0;
    onPointerDownLon = 0;
    onPointerDownLat = 0;
    lon = 0;
    onMouseDownLon = 0;
    lat = 0;
    onMouseDownLat = 0;
    phi = 0;
    theta = 0;
    currmap = 'vanguard';
    $scope.show = true;
    $scope.maps = maps;

    $scope.change360 = function(map) {
      $scope.controlsGlimpse = true;
      $rootScope.$broadcast('changebg', map);
      return $timeout(hidecontrols, 2000);
    };
    hidecontrols = function() {
      return $scope.controlsGlimpse = false;
    };
    $scope.$on('changebg', function(event, map) {
      var newmap;
      if (currmap !== map) {
        newmap = THREE.ImageUtils.loadTexture($scope.maps[map]['panorama']);
        $scope.show = false;
        $timeout(function() {
          material.map = newmap;
          $scope.show = true;
          return currmap = map;
        }, 300);
      }
      return $scope.v360();
    });
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
    $scope.v360inControl = false;
    $scope.v360 = function() {
      $scope.v360focus = !$scope.v360focus;
      if (!$scope.v360focus) {
        return $scope.v360inControl = false;
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
    $scope.$on('$locationChangeStart', function(event, next, current) {
      if ($scope.v360focus) {
        $scope.v360();
        return event.preventDefault();
      }
    });
    $scope.isActive = function(viewLocation) {
      return $location.path().indexOf(viewLocation) === 0;
    };
    $scope.init = function() {
      var geometry, tdcontainer;
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.target = new THREE.Vector3(0, 0, 0);
      camera.position.z = -100;
      camera.lookAt(camera.target);
      scene = new THREE.Scene();
      geometry = new THREE.SphereGeometry(500, 60, 40);
      geometry.scale(-1, 1, 1);
      material = new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load($scope.maps[currmap]['panorama'])
      });
      mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
      renderer = new THREE.WebGLRenderer();
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      tdcontainer = document.getElementById("portfolio");
      tdcontainer.appendChild(renderer.domElement);
      document.addEventListener('mousedown', onDocumentMouseDown, false);
      document.addEventListener('mousemove', onDocumentMouseMove, false);
      document.addEventListener('mouseup', onDocumentMouseUp, false);
      return document.addEventListener('wheel', onDocumentMouseWheel, false);
    };
    onDocumentMouseDown = function(event) {
      if ($scope.v360focus) {
        event.preventDefault();
        isUserInteracting = true;
        onPointerDownPointerX = event.clientX;
        onPointerDownPointerY = event.clientY;
        onPointerDownLon = lon;
        return onPointerDownLat = lat;
      }
    };
    onDocumentMouseUp = function(event) {
      return isUserInteracting = false;
    };
    onDocumentMouseMove = function(event) {
      if (isUserInteracting && $scope.v360focus) {
        $scope.v360inControl = true;
        lon = (onPointerDownPointerX - event.clientX) * 0.1 + onPointerDownLon;
        return lat = (event.clientY - onPointerDownPointerY) * 0.1 + onPointerDownLat;
      }
    };
    onDocumentMouseWheel = function(event) {
      if ($scope.v360focus) {
        camera.fov = Math.max(Math.min(camera.fov + event.deltaY * 0.05, 120), 60);
        return camera.updateProjectionMatrix();
      }
    };
    $scope.animate = function() {
      requestAnimationFrame($scope.animate);
      return $scope.update();
    };
    $scope.update = function() {
      if (!$scope.v360inControl) {
        lon += 0.03;
      }
      lat = Math.max(-85, Math.min(85, lat));
      phi = THREE.Math.degToRad(90 - lat);
      theta = THREE.Math.degToRad(lon);
      camera.target.x = 500 * Math.sin(phi) * Math.cos(theta);
      camera.target.y = 500 * Math.cos(phi);
      camera.target.z = 500 * Math.sin(phi) * Math.sin(theta);
      camera.lookAt(camera.target);
      return renderer.render(scene, camera);
    };
    $scope.init();
    $scope.animate();
    w = angular.element($window);
    return w.bind('resize', function() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      return renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }).controller('ModalController', [
    '$scope', 'close', function($scope, close) {
      return $scope.close = close;
    }
  ])
  .directive("box3d", function($animate, $timeout) {
    return {
      restrict: 'E',
      template: require('../partials/widgets/box3d.html'),
      replace: true,
      scope: {
        map: '@',
        maps: '='
      },
      link: function(scope, element) {
        var clearCanvas, hidecontrols, init3d, layout;
        scope.$emit('isotopeReload');
        scope.closemodels = function() {
          var k, v, _ref;
          scope.loaded = false;
          _ref = scope.maps;
          for (k in _ref) {
            v = _ref[k];
            v['mdlshow'] = false;
          }
        };
        hidecontrols = function() {
          return scope.controlsGlimpse3d = false;
        };
        scope.openmodel = function() {
          scope.closemodels();
          scope.maps[scope.map]['mdlshow'] = true;
        };
        scope.$on('mdlloaded', function(event) {
          scope.controlsGlimpse3d = true;
          scope.loaded = true;
          scope.$apply();
          $timeout(hidecontrols, 2000);
        });
        scope.$watch("maps." + scope.map + ".mdlshow", function(show, oldShow) {
          if (!show) {
            $animate.removeClass(element, 'big').then(layout);
            $animate.removeClass(element.find('.box-3d'), 'big').then(clearCanvas);
          }
          if (show) {
            $animate.addClass(element, 'big').then(layout);
            return $animate.addClass(element.find('.box-3d'), 'big').then(init3d);
          }
        });
        layout = function() {
          return scope.$emit('isotopeLayout');
        };
        init3d = function() {
          return scope.$emit('init3d', scope.map);
        };
        return clearCanvas = function() {
          return element.find('canvas').remove();
        };
      }
    };
  }).directive("boxMain", function() {
    return {
      restrict: 'E',
      template: require('../partials/widgets/boxmain.html'),
      scope: {
        map: '@',
        maps: '='
      }
    };
  });
