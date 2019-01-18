module.exports = function() {
  return function(items, label) {
  	if(label != '' && items){
    var out = [];
      for (var i = 0; i < items.length; i++){
          if(items[i].labels && items[i].labels.indexOf(label) !== -1)
              out.push(items[i]);
      }
    return out;
  }
  return items;
  };
};
