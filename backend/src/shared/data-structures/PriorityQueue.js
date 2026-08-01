class PriorityQueue {
  constructor(comparator = (a, b) => a > b) {
    this.heap = [];
    this.comparator = comparator;
  }

  get size() {
    return this.heap.length;
  }

  isEmpty() {
    return this.size === 0;
  }

  peek() {
    return this.isEmpty() ? null : this.heap[0];
  }

  enqueue(value) {
    this.heap.push(value);
    this._siftUp();
  }

  dequeue() {
    if (this.isEmpty()) return null;
    
    const root = this.heap[0];
    const bottom = this.heap.pop();
    
    if (this.size > 0) {
      this.heap[0] = bottom;
      this._siftDown();
    }
    
    return root;
  }

  _parent(index) {
    return Math.floor((index - 1) / 2);
  }

  _leftChild(index) {
    return (index * 2) + 1;
  }

  _rightChild(index) {
    return (index * 2) + 2;
  }

  _swap(i, j) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }

  _siftUp() {
    let nodeIndex = this.size - 1;
    
    while (nodeIndex > 0 && this.comparator(this.heap[nodeIndex], this.heap[this._parent(nodeIndex)])) {
      this._swap(nodeIndex, this._parent(nodeIndex));
      nodeIndex = this._parent(nodeIndex);
    }
  }

  _siftDown() {
    let nodeIndex = 0;
    
    while (
      (this._leftChild(nodeIndex) < this.size && this.comparator(this.heap[this._leftChild(nodeIndex)], this.heap[nodeIndex])) ||
      (this._rightChild(nodeIndex) < this.size && this.comparator(this.heap[this._rightChild(nodeIndex)], this.heap[nodeIndex]))
    ) {
      let greaterChildIndex = this._leftChild(nodeIndex);
      
      if (
        this._rightChild(nodeIndex) < this.size && 
        this.comparator(this.heap[this._rightChild(nodeIndex)], this.heap[greaterChildIndex])
      ) {
        greaterChildIndex = this._rightChild(nodeIndex);
      }
      
      this._swap(nodeIndex, greaterChildIndex);
      nodeIndex = greaterChildIndex;
    }
  }
}

module.exports = PriorityQueue;
