function popover ($compile, $sce, $templateCache, $window){
  "ngInject"

  return {
    restrict: 'A',
    scope: {
      content: '@popTemplate',
      data: '=popData'
    },
    link: function(scope, element, attrs){

      scope.displayPopover = false;
      scope.updateTootipPosition = function(top, left) {

      };
      function getSafeContent(content){
        return $compile(scope.$eval($templateCache.get(content)));
      }
      var poper = element[0];
      var content = angular.element(document.getElementById('content'));
      var popover = angular.element(
        '<div ng-class="{\'hidden\': !displayPopover}" class="popover">' +
          $templateCache.get(scope.content) +
          '<div class="arrow"></div></div>'
      );
      content.append(popover);

      function findOffsets(elem, offsets){
        if (elem.offsetParent == null){ return offsets; }
        if ("content" == elem.id){ return offsets; }
        offsets.left += elem.offsetLeft;
        offsets.top += elem.offsetTop;
        return findOffsets(elem.offsetParent, offsets);
      }
      function isPopover(elem){
        // Determine if click is in popover
        if (elem.parentElement == null){ return false; }
        if (popover[0] == elem){ return true; }
        if (poper == elem){ return true; }
        return isPopover(elem.parentElement);
      }
      scope.$on('$destroy', function(){
        popover[0].remove();
      });

      function onclick(event){
        if (scope.displayPopover && !isPopover(event.target)){
          close();
          scope.$apply();
        }
      }
      function open(){
        scope.displayPopover = true;
        place();
        angular.element($window).on('click', onclick);
      }
      function close(){
        scope.displayPopover = false;
        angular.element($window).off('click', onclick);
      }
      element.on('click', function(event){
        if (scope.displayPopover){ close(); }
        else { open(); }
        scope.$digest();
        event.preventDefault();
      })

      function place(){
        var offsets = findOffsets(poper, {left:0, top:0});

        var targetCoordX;
        var targetCoordY;

        var popoverWidth = popover[0].clientWidth;
        var relativeLeft = offsets.left - (popoverWidth / 2) +
            (poper.clientWidth / 2);

        var popoverHeight = popover[0].clientHeight;
        var relativeTop = offsets.top - popoverHeight - 20;

        popover.css({ top: relativeTop + 'px',
                      left: relativeLeft + 'px'});
      }
      $compile(popover)(scope);
    }
  }
}
export default popover;
