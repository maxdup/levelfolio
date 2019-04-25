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
}

export default pageController;
