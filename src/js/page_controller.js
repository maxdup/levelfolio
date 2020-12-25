function pageController($scope, $state, $stateParams) {
  "ngInject"

  function queue(level) {
    // Order maps
    var front, k, v, _ref;
    front = {};
    $scope.mapsQueue = [];
    _ref = $scope.maps;
    for (k in _ref) {
      v = _ref[k];
      if (v['level'] === level) {
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

  if ($state.$current.includes['commercial']){
    queue(1);
  } else if ($state.$current.includes['hobby']){
    queue(0);
  }
}

export default pageController;
