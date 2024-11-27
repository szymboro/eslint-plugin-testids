'use strict';

const rule = require('../../../lib/rules/validate-data-testid-format');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester();

ruleTester.run('validate-data-testid-format', rule, {
  valid: [
    'html`<button data-testid="add--button--interestrates"></button>`',
    'html`<input data-testid="add--input--click">Click Me</input>`',
  ],
  invalid: [
    {
      code: 'html`<button data-testid="add--text--interestrates"></button>`',
      errors: [
        {
          message:
            "The second part of 'data-testid' for <button> must match its type (expected: 'button', found: 'text').",
        },
      ],
    },
    {
      code: 'html`<input data-testid="add--button--field" type="text" />`',
      errors: [
        {
          message:
            "The second part of 'data-testid' for <input> must match its type (expected: 'input', found: 'button').",
        },
      ],
    },
  ],
});
