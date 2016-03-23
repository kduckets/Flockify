module.exports = function(){

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

};
