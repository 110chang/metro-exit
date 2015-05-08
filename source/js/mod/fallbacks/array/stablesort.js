/*
*
*   Fallbacks/Array/StableSort
*
*   @author Yuji Ito @110chang
*   via: http://nmm.blog.jp/archives/24688861.html
*
*/

define([], function() {
  var orgSort = Array.prototype.sort;

  function __compare(a, b) {
    return a - b;
  }

  if (!Array.prototype.stableSort) {
    Array.prototype.stableSort = function(compare) {
      compare = compare || __compare;

      var i = 0, l = this.length;
      for(; i < l; i++) {
        this[i].___id = i;
      }
      orgSort.call(this, function(a, b) {
        return (compare.call(this, a, b)) || (a.___id > b.___id ? 1 : -1);
      });
      for(i = 0; i < l; i++) {
        delete this[i].___id;
      }
      return this;
    };
  }
  return Array.prototype.stableSort;
});
