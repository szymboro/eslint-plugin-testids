# Validate the format of `data-testid` attributes. (`require-data-testid`)

Rule checks if specified tags contain valid format data-testid

## Rule Details

This rule aims to...

Examples of **incorrect** code for this rule:

```js
html`<button data-testid="addbuttonclick">Click Me</button>`;
html`<input data-testid="add--button--message">Important message</input>`;
```

Examples of **correct** code for this rule:

```js
html`<button data-testid="add--button--click">Click Me</button>`;
html`<input data-testid="add--input--message">Important message</input>`;
```

## When Not To Use It

If you don't want to have data-testids checked
