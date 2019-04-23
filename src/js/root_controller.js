var THREE = require('three');
import maps from './maps_meta.js';

function rootController(
  $rootScope, $scope, $state, $transitions, $timeout, $templateCache) {
  "ngInject"

  var  hidecontrols, isUserInteracting, lat, lon, material,
      mesh, onDocumentMouseDown, onDocumentMouseMove, onDocumentMouseUp,
      onDocumentMouseWheel, onMouseDownLat, onMouseDownLon, onPointerDownLat,
      onPointerDownLon, onPointerDownPointerX, onPointerDownPointerY, phi,
      renderer, routes, scene, theta, w;

  angular.element(document.querySelector('.content'))
    .bind('mousewheel', function(event, delta){
      this.scrollLeft += event.originalEvent.deltaY;
      event.preventDefault();
    });

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

  var states = $state.get();
  $transitions.onStart({}, function(transition){
    // Determine route change direction
    var from = transition.from().name;
    var to = transition.to().name;
    for (var i = 0; i < states.length; i++){
      if (to == states[i].name){ $scope.reverse = true; break;}
      if (from == states[i].name){ $scope.reverse = false; break;}
    }
    // Reset mdlshow
    var k
    for (k in $scope.maps) {
      $scope.maps[k].mdlshow = false;
    }
    return true;
  })
}
export default rootController;
