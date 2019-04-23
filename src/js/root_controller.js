var THREE = require('three');
import maps from './maps_meta.js';

function rootController(
  $rootScope, $scope,  $route, $routeParams, $timeout,  $templateCache) {
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


  // Determine route change direction
  /*routes = ["/home", "/commercial", "/hobby/:map?", "/code", "/contact"];
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
    var k, v, _ref;
    if (!current || !current['$$route']) {
    return;
    }
    _ref = $scope.maps;
    for (k in _ref) {
    v = _ref[k];
    v['mdlshow'] = false;
    }
    $scope.reverse = routes.indexOf(current['$$route']['originalPath']) >
    routes.indexOf(next['$$route']['originalPath']);
    });*/
}
export default rootController;
