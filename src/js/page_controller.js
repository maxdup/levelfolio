function pageController(
  $scope, $stateParams) {
  "ngInject"

  function queue() {
    // Order maps
    var front, k, v, _ref;
    front = {};
    $scope.mapsQueue = [];
    _ref = $scope.maps;
    for (k in _ref) {
      v = _ref[k];
      if (v['level'] === 0) {
        if (k === $stateParams.map) {
          front = v;
        } else {
          $scope.mapsQueue.push(v);
        }
      }
    }
    $scope.mapsQueue.sort(function(a, b) {
      return a['order'] - b['order'];
    });
    if (front) {
      return $scope.mapsQueue.unshift(front);
    }
  }
  queue();

  /*$scope.viewcarouselmodal = function(id) {
    if (id == null) {
    id = '';
    }
    return ModalService.showModal({
    template: require("../partials/widgets/modal_carousel.html"),
    controller: "ModalController"
    }).then(function(modal) {
    var boxcarousel, carousel, overlay;
    $scope.modal = modal;
    $scope.modalactive = true;
    boxcarousel = $(".box-carousel" + id)[0];
    carousel = $(id + " > .slides_control")[0];
    overlay = document.getElementById("overlay");
    overlay.appendChild(carousel);
    return modal.close.then(function(result) {
    $scope.modalactive = false;
    return boxcarousel.appendChild(carousel);
    });
    });
    };*/
}

export default pageController;
