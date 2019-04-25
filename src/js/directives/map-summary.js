function map_summary (){
  return {
    restrict: 'E',
    replace: true,
    template: require('../../partials/widgets/map-summary.html'),
    scope: { map: '=', },
  }
}
export default map_summary;
