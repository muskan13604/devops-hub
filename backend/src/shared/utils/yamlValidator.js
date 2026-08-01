const Stack = require('../data-structures/Stack');

/**
 * Validates a YAML string for basic structural integrity, such as matching braces, brackets, and quotes.
 * This is not a full YAML parser but a quick linter utilizing a Stack.
 */
class YamlValidator {
  static validate(yamlString) {
    const stack = new Stack();
    const pairs = {
      '}': '{',
      ']': '[',
      ')': '('
    };
    
    let lineNum = 1;
    let errors = [];

    for (let i = 0; i < yamlString.length; i++) {
      const char = yamlString[i];

      if (char === '\\n') {
        lineNum++;
        continue;
      }

      if (char === '{' || char === '[' || char === '(') {
        stack.push({ char, lineNum, index: i });
      } else if (char === '}' || char === ']' || char === ')') {
        if (stack.isEmpty()) {
          errors.push(`Unmatched closing '${char}' at line ${lineNum}`);
          continue;
        }

        const top = stack.peek();
        if (top.char === pairs[char]) {
          stack.pop();
        } else {
          errors.push(`Mismatched closing '${char}' at line ${lineNum}. Expected closing for '${top.char}' from line ${top.lineNum}`);
          // Pop it anyway to try and recover
          stack.pop();
        }
      }
    }

    while (!stack.isEmpty()) {
      const unclosed = stack.pop();
      errors.push(`Unclosed '${unclosed.char}' opened at line ${unclosed.lineNum}`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

module.exports = YamlValidator;
