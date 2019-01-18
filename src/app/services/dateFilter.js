module.exports = function() {
  return function(items, startDate, endDate) {
    if(items){
    // todo: use moment range
    return items.filter(function(item){
      return moment(item.created_ts).isBetween(startDate, endDate);
    });
  }
  };
};
