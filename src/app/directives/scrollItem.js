module.exports = function(){

  return{
    require : "^keepScroll",
    link : function(scope, el, att, scrCtrl){
      scrCtrl.addItem(el[0]);
    }
  }
};
