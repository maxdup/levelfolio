function navbar ($cookies, $translate, $location,
                 $window, $timeout, $rootScope){
  "ngInject"

  return {
    restrict: 'E',
    replace: true,
    template: require('../../partials/widgets/navbar.html').default,
    link: function(scope, element){

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
      scope.toggle_open = function(){
        if(scope.isNavOpen){ close() }
        else { open() }
      }
      function open(){
        scope.isNavOpen = true;
        angular.element($window).on('click', onclick);
      }
      function close(){
        scope.isNavOpen = false;
        angular.element($window).off('click', onclick);
      }
      function onclick(event){
        if (scope.isNavOpen && !isNavMenu(event.target)){
          close();
          scope.$apply();
        }
      }
      function reset(){
        $timeout(function(){ close(); checkOverflow(); });
      }

      var nav_menu = element.find('.navbar-menu')[0];
      var nav_menu_toggle = element.find('.navbar-menu-toggle')[0];
      function isNavMenu(elem){
        // Determine if click is in nav menu
        if (elem.parentElement == null){ return false; }
        if (nav_menu_toggle == elem){ return true; }
        if (nav_menu == elem){ return true; }
        return isNavMenu(elem.parentElement);
      }

      scope.$on('$locationChangeStart', reset);
      $rootScope.$watch('focus360', reset)

      scope.isActive = function(viewLocation) {
        return $location.path().indexOf(viewLocation) === 0;
      };
    }
  }
}
export default navbar;
