function map_summary ($sce){
  "ngInject"

  return {
    restrict: 'E',
    replace: true,
    template: require('../../partials/widgets/map-summary.html'),
    scope: { map: '=', },
    link: function(scope, element){
      scope.icon_exclaim = $sce.trustAsHtml(require('octicons')['issue-opened'].toSVG());
      console.log
      scope.icon_chevron = $sce.trustAsHtml(require('octicons')['chevron-down'].toSVG());
    }
  }
}
export default map_summary;
