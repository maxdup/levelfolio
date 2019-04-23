function navbar ($sce, $cookies, $translate, $location, $window, $timeout){
  "ngInject"

  return {
    restrict: 'E',
    replace: true,
    template: require('../../partials/widgets/navbar.html'),
    link: function(scope, element){

      scope.icon_menu = $sce.trustAsHtml(require('octicons')['grabber'].toSVG());

      function checkOverflow(){
        scope.overflow = element[0].clientWidth < element[0].scrollWidth;
        if (!scope.overflow){ scope.isNavOpen = false; }
      }
      function checkAsync(){ checkOverflow(); scope.$apply(); }
      angular.element($window).on('resize', checkAsync);

      scope.translate = function(lang) {
        scope.active_lang = lang;
        $translate.use(lang);
        $timeout(checkOverflow);
        $cookies.put('lang', lang);
      }

      if ($cookies.get('lang')) {
        scope.translate($cookies.get('lang'));
      } else {
        scope.active_lang = $translate.use();
      }

      scope.$on('$locationChangeStart', function(event, next, current) {
        scope.isNavOpen = false;
        checkOverflow();
      });

      scope.isActive = function(viewLocation) {
        return $location.path().indexOf(viewLocation) === 0;
      };
    }
  }
}
export default navbar;
