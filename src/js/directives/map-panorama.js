var THREE = require('three');

function map_panorama($window, $timeout, $sce, $transitions){
  "ngInject"

  return {
    restrict: 'E',
    template: require('../../partials/widgets/map-panorama.html'),
    scope: {
      ngModel: '=',
      focus: '='
    },
    link: function(scope, element) {
      scope.icon_info = $sce.trustAsHtml(require('octicons')['info'].toSVG());
      scope.icon_chevron = $sce.trustAsHtml(require('octicons')['chevron-right'].toSVG());

      var camera, hidecontrols, isUserInteracting, lat, lon, material,
          mesh,
          onMouseDownLat, onMouseDownLon, onPointerDownLat,
          onPointerDownLon, onPointerDownPointerX, onPointerDownPointerY, phi,
          renderer, routes, scene, theta, w;

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
      scope.show = true;


      function hide_controls(){
        scope.controlsGlimpse = false;
      }
      function preview_controls(){
        scope.controlsGlimpse = true;
        $timeout(hide_controls, 2000);
      }
      scope.$watch('focus', function(newValue, oldValue){
        if (scope.focus){
          preview_controls();
        }
      })
      scope.$watch('ngModel', function(newValue, oldValue){
        if (newValue.partial != oldValue.partial){
          var newmap = THREE.ImageUtils.loadTexture(scope.ngModel['panorama']);
          scope.show = false;
          $timeout(function() {
            material.map = newmap;
            scope.show = true;
          }, 300);
          scope.v360();
        }
      })

      scope.heldControl = false;

      scope.v360 = function() {
        scope.focus = !scope.focus;
        if (!scope.focus) {
          scope.heldControl = false;
        }
      };
      $transitions.onStart({}, function(transition){
        if (scope.focus) {
          scope.v360();
          return false;
        }
        return true;
      });
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
          lon = (onPointerDownPointerX - event.clientX) * 0.1 + onPointerDownLon;
          lat = (event.clientY - onPointerDownPointerY) * 0.1 + onPointerDownLat;
        }
      };
      function onDocumentMouseWheel(event) {
        if (scope.focus) {
          camera.fov = Math.max(Math.min(camera.fov + event.deltaY * 0.05, 120), 60);
          camera.updateProjectionMatrix();
        }
      };

      scope.init = function() {
        var geometry, tdcontainer;
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.target = new THREE.Vector3(0, 0, 0);
        camera.position.z = -100;
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
      scope.update = function() {
        if (!scope.heldControl) {
          lon += 0.03;
        }
        lat = Math.max(-85, Math.min(85, lat));
        phi = THREE.Math.degToRad(90 - lat);
        theta = THREE.Math.degToRad(lon);
        camera.target.x = 500 * Math.sin(phi) * Math.cos(theta);
        camera.target.y = 500 * Math.cos(phi);
        camera.target.z = 500 * Math.sin(phi) * Math.sin(theta);
        camera.lookAt(camera.target);
        renderer.render(scene, camera);
      };
      scope.init();
      scope.animate();
      w = angular.element($window);
      w.bind('resize', function() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      });
    }
  }
}
export default map_panorama;
