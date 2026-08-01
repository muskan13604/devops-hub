/**
 * Compares two strings line by line using Dynamic Programming (LCS / Edit Distance)
 */
class YamlDiff {
  
  /**
   * Calculates the Longest Common Subsequence of two arrays of strings.
   * Useful to find lines that are completely unchanged.
   * @param {Array<string>} lines1 
   * @param {Array<string>} lines2 
   * @returns {Array<string>} The longest common subsequence of lines.
   */
  static lcs(lines1, lines2) {
    const m = lines1.length;
    const n = lines2.length;
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

    // Build the DP table
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (lines1[i - 1] === lines2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
      }
    }

    // Backtrack to find the LCS
    let lcs = [];
    let i = m, j = n;
    while (i > 0 && j > 0) {
      if (lines1[i - 1] === lines2[j - 1]) {
        lcs.unshift(lines1[i - 1]);
        i--;
        j--;
      } else if (dp[i - 1][j] > dp[i][j - 1]) {
        i--;
      } else {
        j--;
      }
    }
    
    return lcs;
  }

  /**
   * Compares two YAML strings line by line and produces a unified diff
   * highlighting additions and deletions, based on Edit Distance alignment.
   * @param {string} yaml1 
   * @param {string} yaml2 
   * @returns {Array<{type: string, value: string}>} Array of diff objects
   */
  static diff(yaml1, yaml2) {
    const lines1 = yaml1.split('\n');
    const lines2 = yaml2.split('\n');

    const m = lines1.length;
    const n = lines2.length;
    
    // DP table for Edit Distance
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (lines1[i - 1] === lines2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1]; // No cost
        } else {
          dp[i][j] = 1 + Math.min(
            dp[i - 1][j],    // Deletion
            dp[i][j - 1],    // Insertion
            dp[i - 1][j - 1] // Substitution
          );
        }
      }
    }

    // Backtrack to construct the diff
    const diffList = [];
    let i = m, j = n;
    
    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && lines1[i - 1] === lines2[j - 1]) {
        diffList.unshift({ type: 'unchanged', value: lines1[i - 1] });
        i--; j--;
      } else if (j > 0 && (i === 0 || dp[i][j - 1] + 1 === dp[i][j])) {
        // Insertion (exists in yaml2, not in yaml1)
        diffList.unshift({ type: 'added', value: lines2[j - 1] });
        j--;
      } else if (i > 0 && (j === 0 || dp[i - 1][j] + 1 === dp[i][j])) {
        // Deletion (exists in yaml1, not in yaml2)
        diffList.unshift({ type: 'removed', value: lines1[i - 1] });
        i--;
      } else {
        // Substitution (treated as a removal then an addition for diff clarity)
        diffList.unshift({ type: 'added', value: lines2[j - 1] });
        diffList.unshift({ type: 'removed', value: lines1[i - 1] });
        i--; j--;
      }
    }

    return diffList;
  }
}

module.exports = YamlDiff;
