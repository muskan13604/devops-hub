class TrieNode {
  constructor() {
    this.children = new Map();
    this.isEndOfWord = false;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(word) {
    let current = this.root;
    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      if (!current.children.has(char)) {
        current.children.set(char, new TrieNode());
      }
      current = current.children.get(char);
    }
    current.isEndOfWord = true;
  }

  search(word) {
    let current = this.root;
    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      if (!current.children.has(char)) {
        return false;
      }
      current = current.children.get(char);
    }
    return current.isEndOfWord;
  }

  startsWith(prefix) {
    let current = this.root;
    for (let i = 0; i < prefix.length; i++) {
      const char = prefix[i];
      if (!current.children.has(char)) {
        return false;
      }
      current = current.children.get(char);
    }
    return true;
  }

  _findWordsFromNode(node, prefix, results) {
    if (node.isEndOfWord) {
      results.push(prefix);
    }
    
    for (const [char, childNode] of node.children.entries()) {
      this._findWordsFromNode(childNode, prefix + char, results);
    }
  }

  getAutocompleteSuggestions(prefix) {
    let current = this.root;
    const suggestions = [];

    // Traverse the trie up to the end of the prefix
    for (let i = 0; i < prefix.length; i++) {
      const char = prefix[i];
      if (!current.children.has(char)) {
        return suggestions; // No matching prefix
      }
      current = current.children.get(char);
    }

    // DFS to find all words from the current node
    this._findWordsFromNode(current, prefix, suggestions);
    
    return suggestions;
  }
}

module.exports = Trie;
