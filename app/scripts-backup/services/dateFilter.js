'use strict'

app.filter('isAfter', function() {
  return function(items, dateAfter) {
    // Using ES6 filter method
    return items.filter(function(item){
      return moment(item.date).isAfter(dateAfter);
    });
  };
});