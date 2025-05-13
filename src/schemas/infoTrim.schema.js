// src/schemas/infoTrim.schema.js
export default {
    fields: {
      configuration: {
        type: 'string',
        default: '',
        tip: 'Trim/config name',
        path: ['Configuration']
      },
      description: {
        type: 'string',
        default: '',
        tip: 'Description',
        path: ['Description']
      },
      year: {
        type: 'number',
        default: 0,
        tip: 'Model year',
        path: ['Years','min'],
        postUpdate: (rootObj, newYear) => {
          // mirror min → max
          if (rootObj.Years) {
            rootObj.Years.max = newYear;
          }
        }
      },
      fuelType: {
        type: 'string',
        default: '',
        tip: 'Fuel type',
        path: ['Fuel Type']
      }
    }
  };
  