/**
 * Performs a binary search on a sorted array of objects.
 * 
 * @param {Array<Object>} sortedArray - The array to search, sorted by a specific key
 * @param {any} target - The value to search for
 * @param {string|Function} key - The object key or extractor function to compare against
 * @returns {Object|null} The matching object or null if not found
 */
function binarySearch(sortedArray, target, key) {
  let left = 0;
  let right = sortedArray.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    // Extract the value to compare
    const midValue = typeof key === 'function' ? key(sortedArray[mid]) : sortedArray[mid][key];

    if (midValue === target) {
      return sortedArray[mid];
    }

    if (midValue < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return null;
}

module.exports = binarySearch;
