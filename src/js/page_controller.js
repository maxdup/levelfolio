var Isotope = require('isotope-layout');
require('isotope-masonry-horizontal')

function pageController(
  $rootScope, $scope, $window, $timeout, $document,
  ModalService, $state, $stateParams, $transitions) {
  "ngInject"

  var SCREEN_HEIGHT, SCREEN_WIDTH, SHADOW_MAP_HEIGHT, SHADOW_MAP_WIDTH,
      animate, camera, controls, createHUD, light, lightShadowMapViewer,
      material, render, renderer, scene, scene2, showHUD;

  function queue() {
    // Order maps
    var front, k, v, _ref;
    front = {};
    $scope.mapsQueue = [];
    _ref = $scope.maps;
    for (k in _ref) {
      v = _ref[k];
      if (v['level'] === 0) {
        if (k === $stateParams.map) {
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
  }
  queue();
  $scope.layoutLast = function(isLast){
    if (isLast) { $scope.layout(); }
  }
  $scope.layout = function() {
    $scope.iso = new Isotope('.boxes',{
      layoutMode: 'masonryHorizontal',
      itemSelector: '.box',
      getSortData: {
        order: '[important] parseInt'
      },
      sortBy: 'order',
      masonryHorizontal: {
        rowHeight: 200
      }
    });
    if ($scope.iso.element){
      $scope.iso.updateSortData();
      $scope.iso.layout();
    }
  };
  if ($state.current.auto){
    $scope.$on('$viewContentLoaded', function() {
      $scope.layout();
    });
  }
  $scope.reload = function() {
    $scope.iso.reloadItems();
    $scope.layout();
  };

  $scope.$on('isotopeReload', function(event, next, current) {
    // for when a 3d item changed size
    return $scope.reload();
  });
  $scope.$on('isotopeLayout', function(event, next, current) {
    // for when a 3d item
    return $scope.layout();
  });
  $transitions.onStart({}, function(transition){
    if ($scope.modalactive === true) {
      $scope.modalactive = false;
      $scope.modal.scope.close();
    }
  })
  /*$scope.viewimagemodal = function(image) {
    if (image == null) {
    image = '';
    }
    return ModalService.showModal({
    template: require("../partials/widgets/modal_image.html"),
    controller: "ModalController"
    }).then(function(modal) {
    $scope.modal = modal;
    $scope.modalactive = true;
    modal.scope.image = image;
    return modal.close.then(function(result) {
    return $scope.modalactive = false;
    });
    });
    };*/
  /*$scope.viewcarouselmodal = function(id) {
    if (id == null) {
    id = '';
    }
    return ModalService.showModal({
    template: require("../partials/widgets/modal_carousel.html"),
    controller: "ModalController"
    }).then(function(modal) {
    var boxcarousel, carousel, overlay;
    $scope.modal = modal;
    $scope.modalactive = true;
    boxcarousel = $(".box-carousel" + id)[0];
    carousel = $(id + " > .slides_control")[0];
    overlay = document.getElementById("overlay");
    overlay.appendChild(carousel);
    return modal.close.then(function(result) {
    $scope.modalactive = false;
    return boxcarousel.appendChild(carousel);
    });
    });
    };*/

  /*camera = null;
    controls = null;
    scene = null;
    scene2 = null;
    renderer = null;
    material = null;
    light = null;
    SCREEN_WIDTH = '';
    SCREEN_HEIGHT = '';
    SHADOW_MAP_WIDTH = 1024;
    SHADOW_MAP_HEIGHT = 1024;
    lightShadowMapViewer = null;
    showHUD = false;
    $scope.$on('init3d', function(event, id) {
    var ambient, canvas, container, manager, map, mtlloader, wrapcontainer;
    map = $scope.maps[id];
    container = document.getElementById(map['targetid']);
    SCREEN_WIDTH = container.offsetWidth;
    SCREEN_HEIGHT = container.offsetHeight;
    scene = new THREE.Scene();
    scene2 = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x444444, 1.5);
    ambient = new THREE.AmbientLight(0x555555);
    scene.add(ambient);
    light = new THREE.PointLight(0xffffff, 5, 1000, 2);
    light.position.set(200, 300, 0);
    scene.add(light);
    light = new THREE.SpotLight(0xffffff, 1, 0, Math.PI / 2);
    light.position.set(200, 900, 900);
    light.target.position.set(0, 0, 0);
    light.castShadow = true;
    light.shadow = new THREE.LightShadow(new THREE.PerspectiveCamera(50, 1, 1200, 2500));
    light.shadow.bias = 0.0001;
    light.shadow.mapSize.width = SHADOW_MAP_WIDTH;
    light.shadow.mapSize.height = SHADOW_MAP_HEIGHT;
    scene.add(light);
    manager = new THREE.LoadingManager();
    mtlloader = new THREE.MTLLoader();
    mtlloader.load(map['mtlurl'], function(materials) {
    var loader, textureLoader;
    materials.preload();
    loader = new THREE.OBJLoader(manager);
    textureLoader = new THREE.TextureLoader();
    loader.setMaterials(materials);
    return loader.load(map['mdlurl'], function(object) {
    var materials_blueprint;
    object.traverse(function(child) {
    if (child instanceof THREE.Mesh) {
    child.castShadow = true;
    return child.receiveShadow = true;
    }
    });
    object.scale.set(0.1, 0.1, 0.1);
    object.position.y = -95;
    scene.add(object);
    materials_blueprint = [["c1", 0, 0.75, 0.25, 35, -90], ["c2", 0, 0.5, 0.25, 35, -90], ["c3", 0, 0.25, 0.25, 35, -90], ["c4", 0, 0, 0.25, 35, -90], ["cr", 0.25, 0.75, 0.25, 35, -90], ["cb", 0.25, 0.25, 0.25, 35, -90], ["cn", 0.25, 0.5, 0.25, 35, -90], ["pa", 0.25, 0.125, 0.125, 15, -90], ["ph", 0.375, 0.125, 0.125, 15, -90], ["rb", 0.5, 0, 0.5, 45, -30], ["rr", 0.5, 0.5, 0.5, 45, -30]];
    materials = {};
    textureLoader.load("../images/icons/spritesheet.png", function(texture) {
    var ent, geometry, mat, particle, sprite, sprite_shade, sprite_solid, vert, _i, _j, _len, _len1, _ref, _results;
    for (_i = 0, _len = materials_blueprint.length; _i < _len; _i++) {
    mat = materials_blueprint[_i];
    sprite = texture.clone();
    sprite.needsUpdate = true;
    sprite.offset.x = mat[1];
    sprite.offset.y = mat[2];
    sprite.repeat.x = mat[3];
    sprite.repeat.y = mat[3];
    sprite_shade = new THREE.PointsMaterial({
    size: mat[4],
    map: sprite,
    sizeAttenuation: false,
    transparent: true,
    opacity: 0.1,
    depthTest: false
    });
    sprite_solid = new THREE.PointsMaterial({
    size: mat[4],
    map: sprite,
    sizeAttenuation: false,
    alphaTest: 0.1,
    transparent: true
    });
    materials[mat[0]] = [sprite_shade, sprite_solid, mat[5]];
    }
    _ref = map['mdlents'];
    _results = [];
    for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
    ent = _ref[_j];
    geometry = new THREE.Geometry();
    vert = new THREE.Vector3(ent[1], ent[3], ent[2] * -1);
    geometry.vertices.push(vert);
    geometry.scale(0.1, 0.1, 0.1);
    geometry.translate(0, materials[ent[0]][2], 0);
    particle = new THREE.Points(geometry, materials[ent[0]][0]);
    scene2.add(particle);
    particle = new THREE.Points(geometry, materials[ent[0]][1]);
    _results.push(scene2.add(particle));
    }
    return _results;
    });
    return $scope.$broadcast('mdlloaded');
    });
    });
    renderer = new THREE.WebGLRenderer({
    antialias: true
    });
    renderer.setClearColor(scene.fog.color);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    renderer.autoClear = false;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    camera = new THREE.OrthographicCamera(SCREEN_WIDTH / -2, SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, SCREEN_HEIGHT / -2, -500, 1200);
    camera.target = new THREE.Vector3(0, 0, 0);
    camera.position.x = -300;
    camera.position.y = 300;
    camera.position.z = 300;
    camera.lookAt(camera.target);
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.rotateSpeed = 0.1;
    controls.dampingFactor = 0.1;
    controls.enableZoom = true;
    canvas = angular.element(renderer.domElement);
    wrapcontainer = angular.element(container);
    wrapcontainer.append(renderer.domElement);
    return animate();
    });
    animate = function() {
    requestAnimationFrame(animate);
    return render();
    };
    render = function() {
    controls.update();
    renderer.clear();
    renderer.render(scene, camera);
    renderer.render(scene2, camera);
    if (showHUD) {
    return lightShadowMapViewer.render(renderer);
    }
    };
    return createHUD = function() {
    lightShadowMapViewer = new THREE.ShadowMapViewer(light);
    lightShadowMapViewer.position.x = 10;
    lightShadowMapViewer.position.y = SCREEN_HEIGHT - (SHADOW_MAP_HEIGHT / 4) - 10;
    lightShadowMapViewer.size.width = SHADOW_MAP_WIDTH / 4;
    lightShadowMapViewer.size.height = SHADOW_MAP_HEIGHT / 4;
    return lightShadowMapViewer.update();
    };*/
}

export default pageController;
