function modal_image(ModalService, $transitions){
  "ngInject"
  return {
    restrict: 'A',
    scope: true,
    link: function(scope, element, attr){
      var modalInstance;
      element.on('click', function(){
        ModalService.showModal({
          template: require("../../partials/widgets/modal-image.html"),
          controller: function($scope, imagePath, close) {
            "ngInject"

            $scope.close = close;
            $scope.image = imagePath
          },
          inputs: {
            imagePath: attr.modalImage
          }
        }).then(function(modal){
          modalInstance = modal;
          modal.close.then(function(){
            modalInstance = null;
          });
        });
      });
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
export default modal_image;
