module.exports = function() {
  return function(items, startDate) {
    // todo: use moment range
    if (!items || !items.length) { return; }
    return items.filter(function(item){
      return moment(item.show_date).isAfter(startDate);
    });
  };
};
