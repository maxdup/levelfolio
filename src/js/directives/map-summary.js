function map_summary ($sce){
  "ngInject"

  return {
    restrict: 'E',
    replace: true,
    template: require('../../partials/widgets/map-summary.html'),
    scope: { map: '=', },
    link: function(scope, element){
      scope.icon_chevron = $sce.trustAsHtml(require('../../../node_modules/octicons/build/svg/chevron-down.svg'));
      scope.icon_exclaim = $sce.trustAsHtml(require('../../../node_modules/octicons/build/svg/issue-opened.svg'));
    }
  }
}
export default map_summary;
