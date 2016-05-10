module.exports = function() {
  return function(items, label) {
  	if(label != ''){
    var out = [];
      for (var i = 0; i < items.length; i++){
          if(items[i].labels == label)
              out.push(items[i]);
      }      
    return out;
  }
  return items;
  };
};