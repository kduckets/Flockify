module.exports =  function($timeout,$parse) {
   return {
    //scope: true,   // optionally create a child scope
    link: function(scope, element, attrs) {
      var model = $parse(attrs.focus);
      scope.$watch(model, function(value) {
        if(value === true) { 
          $timeout(function() {
            element[0].focus(); 
          });
        }
      });
      // on blur event:
      // element.bind('blur', function() {
      //    scope.$apply(model.assign(scope, false));
      // });
    }
  };
};