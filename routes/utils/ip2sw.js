exports.ip2switch = function(ip){
  var ar = ['a','b','c','d','e','f'];
  var i =parseInt(ip.charAt(10)) -1;
  var sw = 'sw'+ar[i]+''+parseInt(ip.charAt(11));
  return sw;
}
