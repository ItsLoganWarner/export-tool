// src/utils/updateJbeam.js

/**
 * Given the raw .jbeam text and a map of pendingChanges { key: newValue, … },
 * produce a new text with only those assignments updated.
 * Lines beginning with // (or that key buried in comments) will be untouched.
 */
export function updateJbeam(rawContent, pendingChanges) {
  let updated = rawContent;

  for (const [key, value] of Object.entries(pendingChanges)) {
    // serialize value correctly
    const serialized =
      typeof value === 'string'
        ? `"${value}"`
        : value === null
          ? 'null'
          : String(value);

    // this regex only matches _actual_ assignments, not lines commented out
    //   ^[ \t]*"key"\s*:\s*(oldValue)(,)
    // it looks for a line that starts (after optional whitespace) with "key":
    const pattern = new RegExp(
      `(^[ \\t]*"${key}"\\s*:\\s*)(?:"[^"]*"|[^,\\r\\n]+)(,?)`,
      'm'
    );

    updated = updated.replace(pattern, `$1${serialized}$2`);
  }

  return updated;
}
