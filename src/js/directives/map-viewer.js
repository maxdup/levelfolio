var THREE = require('three');

function map_viewer(){
  return {
    restrict: 'E',
    template: require('../../partials/widgets/map-viewer.html'),
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
      clearCanvas = function() {
        return element.find('canvas').remove();
      };
    }
  }
}
export default map_viewer;
