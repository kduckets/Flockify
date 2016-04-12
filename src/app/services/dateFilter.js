module.exports = function() {
  return function(items, startDate, endDate) {;
    // todo: use moment range
    return items.filter(function(item){
      return moment(item.date).isBetween(startDate, endDate);
    });
  };
};
