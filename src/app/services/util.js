module.exports = function() {
  var result = {
    trim: function(text, max_chars){
      return $.trim(text).substring(0, max_chars)
          .split(" ").slice(0, -1).join(" ") + "...";
    }
  };
  return result;
};
