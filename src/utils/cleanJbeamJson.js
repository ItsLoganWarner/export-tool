// utils/cleanJbeamJson.js
export const cleanJbeamJson = (data) => {
    // Remove single-line comments (// comment)
    data = data.replace(/\/\/.*$/gm, '');
  
    // Remove multi-line comments (/* comment */)
    data = data.replace(/\/\*[\s\S]*?\*\//g, '');
  
    // Remove trailing commas before a closing bracket or brace
    data = data.replace(/,(\s*[\]}])/g, '$1');
  
    // Add missing commas between array items
    data = data.replace(/}(\s*)(\[|{|")/g, '},$1$2');
    data = data.replace(/](\s*)(\[|{|")/g, '],$1$2');
  
    // Fix missing commas in property listings
    data = data.replace(/"([^"]+)":\s*([^,}\n\r]+)(\s*[\]}])/g, '"$1": $2,$3');
  
    // Ensure there are commas between key-value pairs in objects if they are missing
    data = data.replace(/}(\s*)(")/g, '},$1$2');
  
    // Remove trailing commas from arrays to avoid JSON parsing errors
    data = data.replace(/,\s*(\])/g, '$1');
  
    return data;
  };
  