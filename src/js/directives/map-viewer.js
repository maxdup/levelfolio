import { MTLLoader, OBJLoader, ShadowMapViewer, OrbitControls} from 'three-full'
var THREE = require('three-full');

function map_viewer($animate, $timeout){
  'ngInject'

  return {
    restrict: 'E',
    template: require('../../partials/widgets/map-viewer.html'),
    replace: true,
    scope: { map: '=' },
    link: function(scope, element) {
      scope.closemodels = function() {
        var k, v, _ref;
        scope.loaded = false;
        _ref = scope.maps;
        for (k in _ref) {
          v = _ref[k];
          v['mdlshow'] = false;
        }
      };
      function hidecontrols() {
        scope.controlsGlimpse3d = false;
      };
      function layout() {
        scope.$emit('isotopeLayout');
      };
      function init3d() {
        initialize3d();
        scope.$emit('init3d', scope.map);
      };
      function clearCanvas() {
        element.find('canvas').remove();
      };
      scope.openmodel = function() {
        scope.closemodels();
        scope.map['mdlshow'] = true;
      };
      scope.$on('mdlloaded', function(event) {
        scope.controlsGlimpse3d = true;
        scope.loaded = true;
        scope.$apply();
        $timeout(hidecontrols, 2000);
      });
      scope.$watch("map.mdlshow", function(show, oldShow) {
        if(show == oldShow){ return }
        if (!show) {
          $animate.removeClass(element, 'big').then(layout);
          $animate.removeClass(element.find('.box-3d'), 'big').then(clearCanvas);
        }
        if (show) {
          $animate.addClass(element, 'big').then(layout);
          return $animate.addClass(element.find('.box-3d'), 'big').then(init3d);
        }
      });

      var camera, controls, scene, scene2, renderer, light = null;

      var SCREEN_WIDTH, SCREEN_HEIGHT;
      const SHADOW_MAP_WIDTH = 1024;
      const SHADOW_MAP_HEIGHT = 1024;

      var showHUD = false;
      var lightShadowMapViewer = null;

      function initialize3d() {

        var map = scope.map;
        var container = document.getElementById(map['targetid']);
        SCREEN_WIDTH = container.offsetWidth;
        SCREEN_HEIGHT = container.offsetHeight;

        scene = new THREE.Scene();
        scene2 = new THREE.Scene();
        var ambient = new THREE.AmbientLight(0x555555);
        scene.fog = new THREE.FogExp2(0x444444, 0.001);
        scene.add(ambient);
        light = new THREE.PointLight(0xffffff, 5, 1000, 2);
        light.position.set(200, 300, 0);
        scene.add(light);
        light = new THREE.SpotLight(0xffffff, 1, 0, Math.PI / 2);
        light.position.set(200, 900, 900);
        light.target.position.set(0, 0, 0);
        light.castShadow = true;
        var lightCam = new THREE.PerspectiveCamera(50, 1, 1200, 2500);
        light.shadow = new THREE.LightShadow(lightCam);
        light.shadow.bias = 0.0001;
        light.shadow.mapSize.width = SHADOW_MAP_WIDTH;
        light.shadow.mapSize.height = SHADOW_MAP_HEIGHT;
        scene.add(light);
        var manager = new THREE.LoadingManager();
        var mtlloader = new MTLLoader();
        mtlloader.load(map['mtlurl'], function(materials) {
          materials.preload();
          var loader = new OBJLoader(manager);
          loader.setMaterials(materials);
          loader.load(map['mdlurl'], function(object) {
            object.traverse(function(child) {
              if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.receiveShadow = true;
              }
            });
            object.scale.set(0.1, 0.1, 0.1);
            object.position.y = -95;
            scene.add(object);

            var materials_blueprint = [
              ["c1", 0, 0.75, 0.25, 35, -90], ["c2", 0, 0.5, 0.25, 35, -90],
              ["c3", 0, 0.25, 0.25, 35, -90], ["c4", 0, 0, 0.25, 35, -90],
              ["cr", 0.25, 0.75, 0.25, 35, -90], ["cb", 0.25, 0.25, 0.25, 35, -90],
              ["cn", 0.25, 0.5, 0.25, 35, -90], ["pa", 0.25, 0.125, 0.125, 15, -90],
              ["ph", 0.375, 0.125, 0.125, 15, -90], ["rb", 0.5, 0, 0.5, 45, -30],
              ["rr", 0.5, 0.5, 0.5, 45, -30]];
            var sprite_materials = {};
            var textureLoader = new THREE.TextureLoader();
            textureLoader.load(require("../../images/icons/spritesheet.png"), function(texture) {
              var ent, geometry, mat, particle, sprite, sprite_shade, sprite_solid,
                  vert, _i, _j, _len, _len1, _ref, _results;
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
                sprite_materials[mat[0]] = [sprite_shade, sprite_solid, mat[5]];
              }
              _ref = map['mdlents'];
              _results = [];
              for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
                ent = _ref[_j];
                geometry = new THREE.Geometry();
                vert = new THREE.Vector3(ent[1], ent[3], ent[2] * -1);
                geometry.vertices.push(vert);
                geometry.scale(0.1, 0.1, 0.1);
                geometry.translate(0, sprite_materials[ent[0]][2], 0);
                particle = new THREE.Points(geometry, sprite_materials[ent[0]][0]);
                scene2.add(particle);
                particle = new THREE.Points(geometry, sprite_materials[ent[0]][1]);
                _results.push(scene2.add(particle));
              }
              return _results;
            });
            scope.$broadcast('mdlloaded');
          });
        });
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setClearColor(0x303030);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
        renderer.autoClear = false;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFShadowMap;
        camera = new THREE.OrthographicCamera(SCREEN_WIDTH / -2, SCREEN_WIDTH / 2,
                                              SCREEN_HEIGHT / 2, SCREEN_HEIGHT / -2,
                                              -500, 1200);
        camera.target = new THREE.Vector3(0, 0, 0);
        camera.position.x = -300;
        camera.position.y = 300;
        camera.position.z = 300;
        camera.lookAt(camera.target);
        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.rotateSpeed = 0.1;
        controls.dampingFactor = 0.1;
        controls.enableZoom = true;
        var canvas = angular.element(renderer.domElement);
        var wrapcontainer = angular.element(container);
        wrapcontainer.append(renderer.domElement);
        if (showHUD) {
          createHUD();
        }
        animate();
      };

      function animate() {
        requestAnimationFrame(animate);
        render();
      };

      function render() {
        controls.update();
        renderer.clear();
        renderer.render(scene, camera);
        renderer.render(scene2, camera);
        if (showHUD) {
          return lightShadowMapViewer.render(renderer);
        }
      };
      function createHUD() {
        console.log('light', light);
        lightShadowMapViewer = new ShadowMapViewer(light);
        lightShadowMapViewer.position.x = 10;
        lightShadowMapViewer.position.y = SCREEN_HEIGHT - (SHADOW_MAP_HEIGHT / 4) - 10;
        lightShadowMapViewer.size.width = SHADOW_MAP_WIDTH / 4;
        lightShadowMapViewer.size.height = SHADOW_MAP_HEIGHT / 4;
        lightShadowMapViewer.update();
      };

    }
  }
}
export default map_viewer;
