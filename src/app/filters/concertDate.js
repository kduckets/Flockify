module.exports = function() {
  return function(items, startDate) {
    // todo: use moment range
    return items.filter(function(item){
      return moment(item.show_date).isAfter(startDate);
    });
  };
};
