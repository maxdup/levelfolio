function rootController(
  $rootScope, $scope, $state, $transitions, $timeout, $templateCache, $window) {
  "ngInject"

  var  hidecontrols, isUserInteracting, lat, lon, material,
      mesh, onDocumentMouseDown, onDocumentMouseMove, onDocumentMouseUp,
      onDocumentMouseWheel, onMouseDownLat, onMouseDownLon, onPointerDownLat,
      onPointerDownLon, onPointerDownPointerX, onPointerDownPointerY, phi,
      renderer, routes, scene, theta, w;

  // Horizontal scrolling
  var scrolldiv = document.querySelector('#scrollable');
  function scroll(event, delta){
    if (Math.abs(event.originalEvent.deltaX) > 0){ return }
    if (event.originalEvent.shiftKey){ return }
    if (event.originalEvent.deltaMode == 1){
      scrolldiv.scrollLeft += event.originalEvent.deltaY * 16;
    }else{
      scrolldiv.scrollLeft += event.originalEvent.deltaY;
    }
  }
  angular.element(scrolldiv).bind('wheel', scroll);

  // Include templates
  $templateCache.put('vanguard', require('../partials/maps/vanguard.html').default);
  $templateCache.put('snowville', require('../partials/maps/snowville.html').default);
  $templateCache.put('effigy', require('../partials/maps/effigy.html').default);
  $templateCache.put('occult', require('../partials/maps/occult.html').default);
  $templateCache.put('hadal', require('../partials/maps/hadal.html').default);
  $templateCache.put("uib/template/carousel/slide.html","");
  $templateCache.put('uib/template/carousel/carousel.html',
                     require('../partials/widgets/carousel.html').default);

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
    // reset scrolling
    scrolldiv.scrollLeft = 0;

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
