class SegmentTree {
  constructor(data, aggregatorFn) {
    this.n = data.length;
    this.tree = new Array(4 * this.n);
    this.aggregatorFn = aggregatorFn; // e.g. Math.max, Math.min, or (a,b) => a+b
    if (this.n > 0) {
      this.build(data, 0, 0, this.n - 1);
    }
  }

  build(data, node, start, end) {
    if (start === end) {
      this.tree[node] = data[start];
    } else {
      const mid = Math.floor((start + end) / 2);
      this.build(data, 2 * node + 1, start, mid);
      this.build(data, 2 * node + 2, mid + 1, end);
      this.tree[node] = this.aggregatorFn(this.tree[2 * node + 1], this.tree[2 * node + 2]);
    }
  }

  update(index, value) {
    this._updateHelper(0, 0, this.n - 1, index, value);
  }

  _updateHelper(node, start, end, index, value) {
    if (start === end) {
      this.tree[node] = value;
    } else {
      const mid = Math.floor((start + end) / 2);
      if (start <= index && index <= mid) {
        this._updateHelper(2 * node + 1, start, mid, index, value);
      } else {
        this._updateHelper(2 * node + 2, mid + 1, end, index, value);
      }
      this.tree[node] = this.aggregatorFn(this.tree[2 * node + 1], this.tree[2 * node + 2]);
    }
  }

  query(l, r) {
    return this._queryHelper(0, 0, this.n - 1, l, r);
  }

  _queryHelper(node, start, end, l, r) {
    if (r < start || end < l) {
      return null; // Out of range
    }
    if (l <= start && end <= r) {
      return this.tree[node]; // Entirely within range
    }
    const mid = Math.floor((start + end) / 2);
    const p1 = this._queryHelper(2 * node + 1, start, mid, l, r);
    const p2 = this._queryHelper(2 * node + 2, mid + 1, end, l, r);

    if (p1 === null) return p2;
    if (p2 === null) return p1;
    return this.aggregatorFn(p1, p2);
  }
}

module.exports = SegmentTree;
