module.exports = function() {
  return function(items, startDate) {;
    // Using ES6 filter method
    return items.filter(function(item){
      return moment(item.date).isAfter(startDate);
    });
  };
};
