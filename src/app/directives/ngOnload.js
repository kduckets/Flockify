module.exports = function(){

  return {
        restrict: "A",
        scope: {
            callback: "&ngOnload"
        },
        link: (scope, element, attrs) => {
            element.on("load", (event) => scope.callback({ event: event }));
          },
        }
      };
