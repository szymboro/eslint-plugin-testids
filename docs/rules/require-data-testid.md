# Ensure all specified tags have a `data-testid` attribute. (`require-data-testid`)

Rule checks if all specified tags contain data-testid

## Rule Details

This rule aims to...

Examples of **incorrect** code for this rule:

```js
html`<button>Click Me</button>`;
```

Examples of **correct** code for this rule:

```js
html`<button data-testid="add--button--click">Click Me</button>`;
```

## When Not To Use It

If you don't want to have data-testids checked
