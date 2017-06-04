function State (items, deepth, level, empty) {
  this.items = items
  this.deepth = deepth
  this.level = level
  this.empty = empty
}
State.prototype.moveToEmpty = function (index) {
  var child = new State(this.items.slice(), this.deepth + 1, this.level, this.empty)
  var temp = child.items[this.empty]
  child.items[this.empty] = child.items[index]
  child.items[index] = temp
  child.empty = index
  child.parent = this
  return child
}
State.prototype.equal = function (state) {
  return this.items.toString() === state.items.toString()
}
State.prototype.getF = function () {
  var items = this.items
  var manhatten = 0
  var geometric = 0
  var wrongNext = 0
  for (var i = 0, len = items.length; i < len; i++) {
    var hr = Math.floor(i / this.level)
    var lr = i % this.level
    var hc = Math.floor(items[i] / this.level)
    var lc = items[i] % this.level
    var dh = Math.abs(hr - hc)
    var dl = Math.abs(lr - lc)
    manhatten += dh + dl
    geometric += Math.sqrt(dh * dh + dl * dl)
    wrongNext = items[i] + 1 !== items[i + 1] ? wrongNext + 1 : wrongNext
  }
  return 5 * (3 * manhatten + 2 * geometric + 1 * wrongNext) + 1 * this.deepth
}

export default State
