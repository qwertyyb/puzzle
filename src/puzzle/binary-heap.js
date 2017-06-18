/*
A binary heap for the puzzle algorithm.
*/
function BinaryHeap () {
  this.size = 0
  this.arr = [0]

  /*
  A comparator used to compare two NPuzzleNode.
  */
  function cmp (a, b) {
    return a.getF() <= b.getF()
  }

  /*
  Return whether the heap is empty.
  */
  this.empty = function () {
    return this.size === 0
  }

  /*
  Insert a new element to the heap.

  @param x the element to be pushed into the heap.
  */
  this.push = function (x) {
    // Element 'x' percolates up in the heap
    var i = ++this.size
    for (; i !== 1 && !cmp(this.arr[Math.floor(i / 2)], x); i = Math.floor(i / 2)) {
      this.arr[i] = this.arr[Math.floor(i / 2)]
    }
    this.arr[i] = x
  }

  /*
  Return the root element of the heap.
  */
  this.top = function () {
    if (this.empty()) {
      return 'BinaryHeap.top(): heap is empty'
    }
    return this.arr[1]
  }

  /*
  Delete the root element of the heap.s
  */
  this.pop = function () {
    if (this.empty()) {
      return 'BinaryHeap.pop(): heap is empty'
    }
    var lastEle = this.arr[this.size--]
    var i, child
    // Empty hole percolate down in the heap
    for (i = 1; (i * 2) <= this.size; i = child) {
      child = i * 2
      if (child !== this.size && cmp(this.arr[child + 1], this.arr[child])) {
        ++child
      }
      if (cmp(lastEle, this.arr[child])) {
        break
      } else {
        this.arr[i] = this.arr[child]
      }
    }
    this.arr[i] = lastEle
  }
};

export default BinaryHeap
