import BinaryHeap from './binary-heap.js'
import State from './state.js'

function Solution (_src, _level, _des, empty) {
  this.states = new BinaryHeap()
  this.path = []
  this.src = new State(_src.slice(), 1, _level, empty)
  this.hasSearched = []
  this.searchedCnt = 0
  this.des = new State(_des)
}

Solution.prototype.run = function () {
  this.states.push(this.src)
  while (!this.states.empty()) {
    var cur = null
    do {
      cur = this.states.top()
      this.states.pop()
    } while (!this.states.empty() && this.hasSearched[cur.items.toString()])

    // If all the nodes in the open list is in the
    // close list, then there is no available path
    // between the two nodes.
    if (this.states.empty() && this.hasSearched[cur.items.toString()]) {
      return
    }

    ++this.searchedCnt
    this.hasSearched[cur.items.toString()] = true

    if (cur.equal(this.des)) {  // Find goal
      this.constructPath(cur)
      this.path.shift()
      return
    }

    var h = Math.floor((cur.empty / cur.level))
    var l = cur.empty % cur.level
    var empty = cur.empty
    var child
    if (h - 1 >= 0) {
      child = cur.moveToEmpty(empty - cur.level)
      if (!this.hasSearched[child.items.toString()]) {
        child.preDirec = 'up'
        this.states.push(child)
      }
    }
    if (l - 1 >= 0) {
      child = cur.moveToEmpty(empty - 1)
      if (!this.hasSearched[child.items.toString()]) {
        child.preDirec = 'left'
        this.states.push(child)
      }
    }
    if (l + 1 < cur.level) {
      child = cur.moveToEmpty(empty + 1)
      if (!this.hasSearched[child.items.toString()]) {
        child.preDirec = 'right'
        this.states.push(child)
      }
    }
    if (h + 1 < cur.level) {
      child = cur.moveToEmpty(empty + cur.level)
      if (!this.hasSearched[child.items.toString()]) {
        child.preDirec = 'down'
        this.states.push(child)
      }
    }
  }
}
Solution.prototype.constructPath = function (state) {
  if (state.parent) {
    this.constructPath(state.parent)
  }
  this.path.push(state.preDirec)
}
export default Solution
