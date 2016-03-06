'use strict'

app.directive("keepScroll", function(){

  return {

    controller : function($scope){
      var element = null;

      this.setElement = function(el){
        element = el;
      }

      this.addItem = function(item){
        // console.log("Adding item", item, item.clientHeight);
        element.scrollTop = (element.scrollTop+item.clientHeight+1);
       //1px for margin from your css (surely it would be possible
       // to make it more generic, rather then hard-coding the value)
      };

    },

    link : function(scope,el,attr, ctrl) {

     ctrl.setElement(el[0]);

    }

  };

})

app.directive("scrollItem", function(){

  return{
    require : "^keepScroll",
    link : function(scope, el, att, scrCtrl){
      scrCtrl.addItem(el[0]);
    }
  }
});