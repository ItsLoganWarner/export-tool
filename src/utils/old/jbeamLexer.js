export function tokenizeJbeam(data) {
    // Step 1: Cleanup using regex to fix common issues
    // Remove comments first
    data = data.replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, '');
  
    // Add missing commas between closing brackets
    data = data.replace(/(\}|\])\s*(\{|\[)/g, '$1,$2');
    
    // Remove trailing commas before closing brackets
    data = data.replace(/,\s*(\}|\])/g, '$1');
    
    // Replace duplicated commas
    data = data.replace(/,,/g, ',');
    data = data.replace(/\[,/g, '[');
    data = data.replace(/\{,/g, '{');
  
    let tokens = [];
    let currentToken = "";
    let insideString = false;
  
    for (let i = 0; i < data.length; i++) {
      const char = data[i];
      const nextChar = data[i + 1];
  
      // Handling string literals
      if (char === '"') {
        insideString = !insideString;
        currentToken += char;
        if (!insideString) {
          tokens.push(currentToken);
          currentToken = "";
        }
        continue;
      }
  
      // Accumulate characters if we're inside a string
      if (insideString) {
        currentToken += char;
        continue;
      }
  
      // Handling braces, brackets, and commas
      if (['{', '}', '[', ']', ':', ','].includes(char)) {
        if (currentToken.trim() !== "") {
          tokens.push(currentToken.trim());
          currentToken = "";
        }
        tokens.push(char);
        continue;
      }
  
      // Skip whitespace
      if (char.trim() === '') {
        if (currentToken.trim() !== "") {
          tokens.push(currentToken.trim());
          currentToken = "";
        }
        continue;
      }
  
      // Accumulate non-whitespace characters
      currentToken += char;
    }
  
    // Push any remaining token
    if (currentToken.trim() !== "") {
      tokens.push(currentToken.trim());
    }
  
    return tokens;
  }
  