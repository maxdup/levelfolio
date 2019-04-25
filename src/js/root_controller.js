function rootController(
  $rootScope, $scope, $state, $transitions, $timeout, $templateCache) {
  "ngInject"

  var  hidecontrols, isUserInteracting, lat, lon, material,
      mesh, onDocumentMouseDown, onDocumentMouseMove, onDocumentMouseUp,
      onDocumentMouseWheel, onMouseDownLat, onMouseDownLon, onPointerDownLat,
      onPointerDownLon, onPointerDownPointerX, onPointerDownPointerY, phi,
      renderer, routes, scene, theta, w;

  // Horizontal scrolling
  var page = document.querySelector('.page');
  var content = document.querySelector('.content');
  angular.element(page).bind('mousewheel', function(event, delta){
      content.scrollLeft += event.originalEvent.deltaY;
      event.preventDefault();
    });

  // Include templates
  $templateCache.put('vanguard', require('../partials/maps/vanguard.html'));
  $templateCache.put('effigy', require('../partials/maps/effigy.html'));
  $templateCache.put('occult', require('../partials/maps/occult.html'));
  $templateCache.put('hadal', require('../partials/maps/hadal.html'));

  $templateCache.put('uib/template/carousel/carousel.html',
                     require('../partials/widgets/carousel.html'));
  $templateCache.put("uib/template/carousel/slide.html",
                     "<div class=\"text-center\" ng-transclude></div>\n");
  // Load maps data
  $scope.maps = require('./maps_meta.js').default;

  // Load Panorama
  $scope.current_panorama = $scope.maps['vanguard'];
  $scope.go_panorama = function(map) {
    if (map == $scope.current_panorama){ $scope.focus360 = true; }
    if (map){ $scope.current_panorama = map;}
  }

  // Routing routines
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
