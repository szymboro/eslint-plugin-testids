'use strict';

const rule = require('../../../lib/rules/require-data-testid');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester();

ruleTester.run('require-data-testid', rule, {
  valid: [
    'html`<button data-testid="add--button--click">Click Me</button>`',
    'html`<input data-testid="add--input--field" type="text" />`',
  ],
  invalid: [
    {
      code: 'html`<button></button>`',
      errors: [
        {
          message: "The <button> tag is missing a 'data-testid' attribute.",
        },
      ],
    },
    {
      code: 'html`<input></input>`',
      errors: [
        {
          message: "The <input> tag is missing a 'data-testid' attribute.",
        },
      ],
    },
  ],
});
