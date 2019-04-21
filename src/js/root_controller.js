var THREE = require('three');
const rootModule = 'folio.RootController';
export default rootModule;

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
    /*$(".content").mousewheel(function(event, delta) {
      this.scrollLeft -= delta * 60;
      return event.preventDefault();
    });*/
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
    $scope.maps = {
      vanguard: {
        order: 0,
        partial: "vanguard",
        mdlurl: '../models/vanguard.obj',
        mtlurl: '../models/vanguard.mtl',
        mdlents: [['cn', 0, 0, 103], ['cr', 1936, -400, 324], ['cr', 4096, -1216, 319], ['cb', -1936, 400, 324], ['cb', -4096, 1216, 319], ['rr', 5300, -950, 310], ['rb', -5300, 950, 310], ['ph', 1265, -548, 109], ['pa', 1265, -484, 109], ['ph', 528, 224, 26], ['pa', 528, 120, 26], ['ph', 92, 528, 202], ['pa', 196, 528, 202], ['ph', 1810, 720, 138], ['pa', 1700, 720, 138], ['ph', 2150, -820, 60], ['pa', 2150, -716, 60], ['pa', 1948, -1760, 250], ['ph', 1844, -1760, 250], ['ph', 3008, -1248, 246], ['pa', 3154, -480, 246], ['ph', 3488, 64, 187], ['pa', 3392, -416, 179], ['pa', 3568, -580, 394], ['ph', 3568, -684, 394], ['ph', -1265, 548, 109], ['pa', -1265, 484, 109], ['ph', -528, -224, 26], ['pa', -528, -120, 26], ['ph', -92, -528, 202], ['pa', -196, -528, 202], ['ph', -1810, -720, 138], ['pa', -1700, -720, 138], ['ph', -2150, 820, 60], ['pa', -2150, 716, 60], ['pa', -1948, 1760, 250], ['ph', -1844, 1760, 250], ['ph', -3008, 1248, 246], ['pa', -3154, 480, 246], ['ph', -3488, -64, 187], ['pa', -3392, 416, 179], ['pa', -3568, 580, 394], ['ph', -3568, 684, 394]],
        targetid: 'vanguard3d',
        mdlshow: false,
        workid: 'cp_vanguard',
        level: 1,
        title: '../../images/vanguard/vanguard.png',
        images: [
          {
            image: '../images/vanguard/cp_vanguard_rc60.jpg',
            id: 0
          }, {
            image: '../images/vanguard/cp_vanguard_rc61.jpg',
            id: 1
          }, {
            image: '../images/vanguard/cp_vanguard_rc62.jpg',
            id: 2
          }, {
            image: '../images/vanguard/cp_vanguard_rc63.jpg',
            id: 3
          }, {
            image: '../images/vanguard/cp_vanguard_rc64.jpg',
            id: 4
          }
        ],
        panorama: '../images/vanguard/cp_vanguard360.jpg'
      },
      hadal: {
        order: 2,
        partial: "hadal",
        mdlurl: '../models/hadal.obj',
        mtlurl: '../models/hadal.mtl',
        mdlents: [['c1', -1664, -622, 396], ['c2', 1828, 292, 512], ['c3', -912, 1680, 544], ['c4', 352, 512, 614], ['rb', 128, -2647, 14], ['rr', -576, -104, 112], ['pa', -946, 448, 567], ['ph', -1054, 448, 567], ['ph', 976, -1012, 493], ['pa', 976, -898, 493], ['pa', 290, 1036, 398], ['ph', 414, 1036, 398], ['ph', 1146, 1256, 589], ['pa', 1234, 1149, 589], ['ph', -1792, 1584, 565], ['ph', -1104, 1824, 465], ['ph', -25, 185, 277], ['pa', 60, 100, 277], ['pa', 2064, -16, 397], ['ph', 2080, -902, 397], ['ph', -1536, -2016, 174], ['pa', -1280, -1312, 13], ['pa', -2000, -272, 267], ['pa', -1080, 1848, 616], ['ph', 1008, 400, 397], ['pa', 1240, -472, 468], ['ph', 1280, -744, 205], ['pa', 960, -1404, 212], ['ph', 1216, 128, 465]],
        targetid: 'hadal3d',
        mdlshow: false,
        workid: "804251853",
        level: 0,
        title: '../images/hadal/hadal.png',
        images: [
          {
            image: '../images/hadal/cp_hadal_b130.jpg',
            id: 0
          }, {
            image: '../images/hadal/cp_hadal_b131.jpg',
            id: 1
          }, {
            image: '../images/hadal/cp_hadal_b132.jpg',
            id: 2
          }, {
            image: '../images/hadal/cp_hadal_b133.jpg',
            id: 3
          }, {
            image: '../images/hadal/cp_hadal_b134.jpg',
            id: 4
          }
        ],
        panorama: '../images/hadal/cp_hadal360.jpg'
      },
      occult: {
        order: 1,
        partial: "occult",
        mdlurl: '../models/occult.obj',
        mtlurl: '../models/occult.mtl',
        mdlents: [["cn", 0, 0, 70], ["pa", 544, 624, -41], ["ph", -328, 96, -126], ["pa", 1216, -130, -160], ["ph", 1216, -254, -160], ["pa", -30, 1152, -33], ["ph", 94, 1152, -27], ["pa", -544, -624, -41], ["ph", 328, -96, -126], ["pa", -1216, 130, -160], ["ph", -1216, 254, -160], ["pa", 30, -1152, -33], ["ph", -94, -1152, -27], ["rr", -1368, -3568, 122], ["rb", 1368, 3568, 122]],
        targetid: 'occult3d',
        mdlshow: false,
        workid: "468770640",
        level: 0,
        title: '../images/occult/occult.png',
        images: [
          {
            image: '../images/occult/koth_occult_rc40.jpg',
            id: 0
          }, {
            image: '../images/occult/koth_occult_rc41.jpg',
            id: 1
          }, {
            image: '../images/occult/koth_occult_rc42.jpg',
            id: 2
          }, {
            image: '../images/occult/koth_occult_rc43.jpg',
            id: 3
          }, {
            image: '../images/occult/koth_occult_rc44.jpg',
            id: 4
          }
        ],
        panorama: '../images/occult/koth_occult360.jpg'
      },
      effigy: {
        order: 3,
        partial: "effigy",
        workid: "543841027",
        level: 0,
        title: '../images/effigy/effigy.png',
        images: [
          {
            image: '../images/effigy/pl_effigy_rc20.jpg',
            id: 0
          }, {
            image: '../images/effigy/pl_effigy_rc21.jpg',
            id: 1
          }, {
            image: '../images/effigy/pl_effigy_rc22.jpg',
            id: 2
          }, {
            image: '../images/effigy/pl_effigy_rc23.jpg',
            id: 3
          }, {
            image: '../images/effigy/pl_effigy_rc24.jpg',
            id: 4
          }
        ],
        panorama: '../images/effigy/pl_effigy360.jpg'
      }
    };
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
  ]).directive("box3d", function($animate, $timeout) {
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
