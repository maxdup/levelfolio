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
          number: '[important] parseInt'
        },
        sortBy: 'number',
        masonryHorizontal: {
          rowHeight: 200
        }
      });
      scope.reload = function() {
        iso.updateSortData();
        iso.arrange({'sortBy': 'number'})
      };
      scope.$on('isotopeReload', scope.reload);
      scope.$on('isotopeLayout', iso.layout);
    }
  }
}
export default isotope;
