class Node {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
    
    // Dummy head and tail to avoid edge cases
    this.head = new Node(null, null);
    this.tail = new Node(null, null);
    
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  _addNode(node) {
    // Always add right after head (most recently used)
    node.prev = this.head;
    node.next = this.head.next;
    
    this.head.next.prev = node;
    this.head.next = node;
  }

  _removeNode(node) {
    const prev = node.prev;
    const next = node.next;
    
    prev.next = next;
    next.prev = prev;
  }

  _moveToHead(node) {
    this._removeNode(node);
    this._addNode(node);
  }

  _popTail() {
    // The least recently used is right before the tail
    const lru = this.tail.prev;
    this._removeNode(lru);
    return lru;
  }

  get(key) {
    if (!this.cache.has(key)) {
      return -1; // Or undefined based on convention, but returning -1 is common in algorithms. 
                 // Let's use null to be more JS idiomatic for objects.
    }
    
    const node = this.cache.get(key);
    this._moveToHead(node);
    return node.value;
  }

  put(key, value) {
    if (this.cache.has(key)) {
      // Update value and move to head
      const node = this.cache.get(key);
      node.value = value;
      this._moveToHead(node);
    } else {
      const newNode = new Node(key, value);
      
      this.cache.set(key, newNode);
      this._addNode(newNode);
      
      if (this.cache.size > this.capacity) {
        // Pop the tail
        const tail = this._popTail();
        this.cache.delete(tail.key);
      }
    }
  }
}

module.exports = LRUCache;
