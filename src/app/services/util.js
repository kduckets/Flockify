module.exports = function() {
  var result = {
    trim: function(text, max_chars){
      if (text.length < max_chars) {
        return text;
      }
      return $.trim(text).substring(0, max_chars)
          .split(" ").slice(0, -1).join(" ") + "...";
    }
  };
  return result;
};
