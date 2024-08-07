function map_viewer($animate, $timeout){
  'ngInject'

  return {
    restrict: 'E',
    template: require('../../partials/widgets/map-viewer.html').default,
    replace: true,
    scope: { map: '=' },
    link: function(scope, element) {

      function layout() {
        scope.$emit('isotopeLayout');
      };
      function reorder() {
        scope.$emit('isotopeReload');
      };
      function clearCanvas() {
        element.find('canvas').remove();
      };
      scope.close_model = function() {
        scope.loaded = false;
        scope.map['mdlshow'] = false;
      };
      scope.open_model = function() {
        scope.loaded = false;
        scope.map['mdlshow'] = true;
      };
      scope.$on('mdlloaded', function(event) {
        scope.loaded = true;
        scope.$apply();
      });
      scope.$watch("map.mdlshow", function(show, oldShow) {
        $timeout(function(){
          if(show == oldShow){ return }
          if (!show) {
            $animate.removeClass(element, 'big').then(reorder);
            $animate.removeClass(element[0].children[0], 'big').then(clearCanvas);
          }
          if (show) {
            $animate.addClass(element, 'big').then(reorder);
            $animate.addClass(element[0].children[0], 'big').then(loadThree);
          }
        });
      });

      var camera, controls, scene, scene2, renderer, light = null;

      var SCREEN_WIDTH, SCREEN_HEIGHT;
      const SHADOW_MAP_WIDTH = 1024;
      const SHADOW_MAP_HEIGHT = 1024;

      var showHUD = false;
      var lightShadowMapViewer = null;
      var THREE;

      function loadThree() {
        require.ensure(['three-full'], function(require){
          THREE = require('three-full');
          $timeout(init3d, 500);
        }, function(error){}, 'THREE-FULL');
      }

      function init3d() {

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
        var mtlloader = new THREE.MTLLoader();
        mtlloader.load(map['mtlurl'], function(materials) {
          materials.preload();
          var loader = new THREE.OBJLoader(manager);
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
        var canvas = angular.element(renderer.domElement);
        var wrapcontainer = angular.element(container);
        wrapcontainer.append(renderer.domElement);
        controls = new THREE.OrbitControls(camera, wrapcontainer[0]);
        controls.enableDamping = true;
        controls.rotateSpeed = 0.5;
        controls.dampingFactor = 1;
        controls.enableZoom = true;
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
