'use strict';

const rule = require('../../../lib/rules/validate-data-testid-format');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester();

ruleTester.run('validate-data-testid-format', rule, {
  valid: [
    'html`<button data-testid="add--button--click">Click Me</button>`',
    'html`<input data-testid="add--input--field" type="text" />`',
    'html`<input data-testid="add--input--${id}" type="text" />`',
  ],
  invalid: [
    {
      code: 'html`<button data-testid="addbuttonclick">Click Me</button>`',
      errors: [
        {
          message:
            "The 'data-testid' must follow the format: componentname--tagname--value (e.g., add--text--interestrates).",
        },
      ],
    },
    {
      code: 'html`<input data-testid="invalid_format" type="text" />`',
      errors: [
        {
          message:
            "The 'data-testid' must follow the format: componentname--tagname--value (e.g., add--text--interestrates).",
        },
      ],
    },
  ],
});
