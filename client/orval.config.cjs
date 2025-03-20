/* eslint-disable no-undef */
module.exports = {
  'busy-bee': {
    output: {
      client: 'zod',
      mode: 'single',
      target: './src/schemas.ts',
    },
    input: {
      target: './openapi.json',
    },
  },
};
