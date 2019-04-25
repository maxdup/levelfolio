function map_carousel (ModalService, $transitions){
  "ngInject"

  return {
    restrict: 'E',
    replace: true,
    template: require('../../partials/widgets/map-carousel.html'),
    scope: { map: '=', },
    link: function(scope, element, attrs){
      var modalInstance;

      scope.open_modal = function(){
        ModalService.showModal({
          template: require("../../partials/widgets/modal.html"),
          controller: function($scope, close) {
            "ngInject"
            $scope.close = close;
          },
        }).then(function(modal){
          var carousel = element.find('.carousel');
          console.log('carousel', carousel);

          modalInstance = modal;
          var overlay = document.getElementById("overlay");
          overlay.append(carousel[0]);
          modal.close.then(function(){
            modalInstance = null;
            element[0].appendChild(carousel[0]);
          });
        });

      }
      var unhook = $transitions.onStart({}, function(transition){
        if (modalInstance){
          modalInstance.scope.close();
          return false;
        }
        return true;
      });
      scope.$on('$destroy', unhook);
    }
  }
}
export default map_carousel;
