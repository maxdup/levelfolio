function modal_image(ModalService, $sce, $transitions){
  "ngInject"
  return {
    restrict: 'A',
    scope: true,
    link: function(scope, element, attr){
      var modalInstance;
      element.on('click', function(){
        ModalService.showModal({
          template: require("../../partials/widgets/modal_image.html"),
          controller: function($scope, imagePath, close) {
            "ngInject"

            $scope.close = close;
            $scope.icon_close =
              $sce.trustAsHtml(require('../../../node_modules/octicons/build/svg/x.svg'));
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
