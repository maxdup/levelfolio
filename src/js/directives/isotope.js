var Isotope = require('isotope-layout');
require('isotope-masonry-horizontal');

function isotope ($window, $timeout){
  "ngInject"

  return {
    restrict: 'E',
    replace: true,
    link: function(scope, element, attrs){
      var iso = new Isotope('#'+attrs.id, {
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
      console.log(iso);

      scope.layout = function() {
        console.log('layout');
        iso = new Isotope('#'+attrs.id, {
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
        if (iso.element){
          iso.updateSortData();
          iso.layout();
        }
      };
      scope.relayout = function(){
        console.log('relayout');
        iso.updateSortData();
        iso.layout();
      }
      scope.$on('$viewContentLoaded', function() {
        console.log('contentloaded');
        scope.layout();
      });
      scope.reload = function() {
        console.log('reloaditems');
        scope.layout();
        iso.reloadItems();
      };
      scope.$on('isotopeReload', function(event, next, current) {
        // for when a 3d item changed size
        console.log('isoReload');
        $timeout(scope.reload());
      });
      scope.$on('isotopeLayout', function(event, next, current) {
        // for when a 3d item
        console.log('isoLayout');
        $timeout(scope.layout());
      });
    }
  }
}
export default isotope;
