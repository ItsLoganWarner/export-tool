// src/schemas/esc/topLevel.schema.js
export default {
    fields: {
      enabledModes: {
        type: 'textarea',
        default: '[]',
        tip: 'Which drive modes are enabled (JSON array of mode-keys)',
        // JSON path into the parsed object for updateJsonPart
        path: ['driveModes', 'enabledModes']
      },
      defaultMode: {
        type: 'string',
        default: '',
        tip: 'Which drive mode is selected by default',
        path: ['driveModes', 'defaultMode']
      }
    }
  };
  