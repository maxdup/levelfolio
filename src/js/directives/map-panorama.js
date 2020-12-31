function map_panorama($window, $timeout, $transitions){
  "ngInject"

  return {
    restrict: 'E',
    template: require('../../partials/widgets/map-panorama.html'),
    scope: {
      ngModel: '=',
      focus: '='
    },
    link: function(scope, element) {

      scope.debug = false;

      var camera, scene, mesh, material, renderer, phi, theta,
          lon, onPointerDownLon, onPointerDownPointerX, onMouseDownLon,
          lat, onPointerDownLat, onPointerDownPointerY, onMouseDownLat,
          hidecontrols, isUserInteracting;

      camera = null;
      scene = null;
      mesh = null;
      material = null;
      renderer = null;
      isUserInteracting = false;
      onPointerDownPointerX = 0;
      onPointerDownPointerY = 0;
      onPointerDownLon = 0;
      onPointerDownLat = 0;
      onMouseDownLon = 0;
      onMouseDownLat = 0;
      lon = 0;
      lat = 0;
      phi = 0;
      theta = 0;

      var isUserInteracting = false;
      scope.show = true;

      function makeCameraVector(longitude, latitude){
        if (!camera.target){
          camera.target = new THREE.Vector3(0,0,0);
        }
        lon = longitude || lon;
        lat = Math.max(-85, Math.min(85, latitude));
        phi = toRad(90 - lat);
        theta = toRad(longitude);
        camera.target.x = 500 * Math.sin(phi) * Math.cos(theta);
        camera.target.y = 500 * Math.cos(phi);
        camera.target.z = 500 * Math.sin(phi) * Math.sin(theta);
        return camera.target;
      }
      function loadMap(){
        scope.show = false;
        function textureCallback(callback){
          makeCameraVector(scope.ngModel.panorama_angle, 0);
          camera.lookAt(camera.target);
          material.map = newmap;
          scope.show = true;
          scope.$apply();
        }
        var newmap = new THREE.TextureLoader().load(
          scope.ngModel['panorama'], textureCallback);
        scope.v360();
      }
      scope.$watch('ngModel', function(newValue, oldValue){
        if (newValue.panorama != oldValue.panorama){
          loadMap();
        }
      });

      scope.heldControl = false;

      scope.v360 = function() {
        scope.focus = !scope.focus;
        if (!scope.focus) {
          scope.heldControl = false;
        }
      };
      var unhook = $transitions.onStart({}, function(transition){
        if (scope.focus) {
          scope.v360();
          return false;
        }
        return true;
      });
      scope.$on('$destroy', unhook);

      function onDocumentMouseDown(event) {
        if (scope.focus) {
          event.preventDefault();
          isUserInteracting = true;
          onPointerDownPointerX = event.clientX;
          onPointerDownPointerY = event.clientY;
          onPointerDownLon = lon;
          onPointerDownLat = lat;
        }
      };
      function onDocumentMouseUp(event) {
        isUserInteracting = false;
      };
      function onDocumentMouseMove(event) {
        if (isUserInteracting && scope.focus) {
          scope.heldControl = true;
          makeCameraVector(
            (onPointerDownPointerX - event.clientX) * 0.1 + onPointerDownLon,
            (event.clientY - onPointerDownPointerY) * 0.1 + onPointerDownLat);
        }
      };
      function onDocumentMouseWheel(event) {
        if (scope.focus) {
          camera.fov = Math.max(Math.min(camera.fov + event.deltaY * 0.05, 120), 60);
          camera.updateProjectionMatrix();
        }
      };

      var THREE;
      scope.load = function() {
        require.ensure(['three-full'],
                       function(require){
                         THREE = require('three-full');
                         scope.init();
                         scope.animate();
                       },
                       function(error){}, 'THREE-FULL');
      }
      scope.init = function() {

        var geometry, tdcontainer;
        camera = new THREE.PerspectiveCamera(
          75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = -100;
        makeCameraVector(scope.ngModel.panorama_angle, 0);
        camera.lookAt(camera.target);
        scene = new THREE.Scene();
        geometry = new THREE.SphereGeometry(500, 60, 40);
        geometry.scale(-1, 1, 1);
        material = new THREE.MeshBasicMaterial({
          map: new THREE.TextureLoader().load(scope.ngModel['panorama'])
        });
        mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        tdcontainer = document.body;
        tdcontainer.appendChild(renderer.domElement);
        document.addEventListener('mousedown', onDocumentMouseDown, false);
        document.addEventListener('mousemove', onDocumentMouseMove, false);
        document.addEventListener('mouseup', onDocumentMouseUp, false);
        document.addEventListener('wheel', onDocumentMouseWheel, false);
      };
      scope.animate = function() {
        requestAnimationFrame(scope.animate);
        scope.update();
      };
      function toRad(degrees){
        return degrees * (Math.PI/180);
      }
      scope.update = function() {
        if (!scope.heldControl) {
          makeCameraVector(lon + 0.03, lat);
        }

        if (scope.debug == true){
          scope.coords = {x:camera.target.x,
                          y:camera.target.y,
                          z:camera.target.z,
                          lon: lon}
          scope.$apply();
        }
        camera.lookAt(camera.target);
        renderer.render(scene, camera);
      };
      scope.load();
      var w = angular.element($window);
      w.bind('resize', function() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      });
    }
  }
}
export default map_panorama;
