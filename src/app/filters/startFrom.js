module.exports = function (){
  return function (input,start) {
    start = +start;
    return input.slice(start);
  }
};