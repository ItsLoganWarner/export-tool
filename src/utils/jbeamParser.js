import { tokenizeJbeam } from './jbeamLexer';

// Define schemas for known jbeam types
const schemas = {
  "Camso_Engine": {
    "requiredKeys": ["information", "slotType", "slots", "powertrain", "mainEngine"],
    "types": {
      "information": "object",
      "slotType": "string",
      "slots": "array",
      "powertrain": "array",
      "mainEngine": "object",
    },
  },
  "Camso_Turbo": {
    "requiredKeys": ["information", "variables", "slotType", "turbocharger"],
    "types": {
      "information": "object",
      "variables": "array",
      "slotType": "string",
      "turbocharger": "object",
    },
  }
};

// Function to match a specific key to a general schema type
const getSchemaTypeFromKey = (key) => {
  console.log(`getSchemaTypeFromKey: Received key -> ${key}`);

  if (!key) {
    console.warn("getSchemaTypeFromKey: Received an empty or null key.");
    return null;
  }

  // Remove extra quotes and whitespace, and get the prefix before the first underscore
  const cleanedKey = key.replace(/^"|"$/g, '').trim();  // Remove leading and trailing quotes
  console.log(`getSchemaTypeFromKey: Cleaned key -> ${cleanedKey}`);

  const prefix = cleanedKey.split('_')[0];
  console.log(`getSchemaTypeFromKey: Extracted prefix -> ${prefix}`);

  // Check if the prefix matches any known schema type
  if (schemas[prefix]) {
    console.log(`getSchemaTypeFromKey: Found matching schema type -> ${prefix}`);
    return prefix;
  } else {
    console.warn(`getSchemaTypeFromKey: No matching schema found for prefix -> ${prefix}`);
    return null;
  }
};

// Function to validate data against the schema
const validateAgainstSchema = (type, data) => {
  console.log(`validateAgainstSchema: Validating data for type -> ${type}`);
  const schema = schemas[type];
  if (!schema) {
    console.warn(`validateAgainstSchema: No schema found for type: ${type}`);
    return;
  }

  const { requiredKeys, types } = schema;

  // Check for required keys
  requiredKeys.forEach((key) => {
    if (!(key in data)) {
      throw new Error(`validateAgainstSchema: Missing required key: ${key} in ${type}`);
    }
  });

  // Validate data types
  for (const [key, value] of Object.entries(data)) {
    if (key in types) {
      const expectedType = types[key];
      if (typeof value !== expectedType) {
        throw new Error(`validateAgainstSchema: Incorrect type for key: ${key}. Expected ${expectedType}, but found ${typeof value}`);
      }
    }
  }

  console.log(`validateAgainstSchema: Successfully validated data for type -> ${type}`);
};

// Main JBeam parsing function
export const parseJbeam = (data) => {
  console.log("parseJbeam: Starting parsing process.");

  const tokens = tokenizeJbeam(data);
  console.log("parseJbeam: Tokens generated ->", tokens);

  let parsedData = {}; // This will hold the final parsed object
  let stack = [parsedData]; // Stack to keep track of nested objects and arrays
  let currentKey = null;

  for (let i = 0; i < tokens.length; i++) {
    let token = tokens[i].trim(); // Remove unnecessary whitespace
    let currentContext = stack[stack.length - 1];

    // Skip comments or invalid tokens that shouldn't be part of the structure
    if (token.startsWith("//") || token === ',' || token === "") {
      continue;
    }

    if (token === '{') {
      // New object context
      console.log(`parseJbeam: Opening a new object at token index ${i}.`);
      let newObject = {};
      if (Array.isArray(currentContext)) {
        currentContext.push(newObject);
      } else if (currentKey) {
        currentContext[currentKey] = newObject;
        currentKey = null;
      } else {
        console.warn("parseJbeam: Opening an object without a key, adding to current context");
        currentContext[`object_${i}`] = newObject;
      }
      stack.push(newObject);
    } else if (token === '}') {
      // Close current context
      console.log(`parseJbeam: Closing object context at token index ${i}.`);
      stack.pop();
    } else if (token === '[') {
      // New array context
      console.log(`parseJbeam: Opening a new array at token index ${i}.`);
      let newArray = [];
      if (Array.isArray(currentContext)) {
        currentContext.push(newArray);
      } else if (currentKey) {
        currentContext[currentKey] = newArray;
        currentKey = null;
      } else {
        console.warn("parseJbeam: Opening an array without a key, adding to current context");
        currentContext[`array_${i}`] = newArray;
      }
      stack.push(newArray);
    } else if (token === ']') {
      // Close array context
      console.log(`parseJbeam: Closing array context at token index ${i}.`);
      stack.pop();
    } else if (token === ':') {
      // Skip colons
      continue;
    } else if (currentKey !== null) {
      console.log(`parseJbeam: Setting key-value -> ${currentKey}: ${token}`);
      if (Array.isArray(currentContext)) {
        throw new Error(`Unexpected key-value pair in an array context at token: ${token}`);
      }
      currentContext[currentKey] = parseValue(token); // Use parseValue to convert string representation
      currentKey = null;
    } else {
      if (Array.isArray(currentContext)) {
        console.log(`parseJbeam: Adding value to array context -> ${token}`);
        currentContext.push(parseValue(token)); // Use parseValue to convert string representation
      } else {
        console.log(`parseJbeam: Setting currentKey -> ${token}`);
        currentKey = parseValue(token);
      }
    }
  }

  // Use schemas to validate parsed data
  const schemaType = getSchemaTypeFromKey(Object.keys(parsedData)[0]);
  if (schemaType) {
    try {
      validateAgainstSchema(schemaType, parsedData);
    } catch (validationError) {
      console.error("Schema validation error:", validationError);
    }
  }

  console.log("parseJbeam: Parsing complete, returning parsed data.");
  console.log("Parsed Data:", JSON.stringify(parsedData, null, 2)); // Display the parsed data
  return parsedData;
};

// Helper function to parse values correctly
const parseValue = (token) => {
  // Remove quotes if it's a string
  if (token.startsWith('"') && token.endsWith('"')) {
    return token.slice(1, -1);
  }

  // Try parsing as a number
  if (!isNaN(token)) {
    return parseFloat(token);
  }

  // Handle booleans
  if (token === "true") {
    return true;
  }
  if (token === "false") {
    return false;
  }

  // Return as-is if none of the above
  return token;
};
