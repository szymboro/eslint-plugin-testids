# eslint-plugin-testids

Main function of this rules is to check for `data-testid` for specific tags in lit

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-testids`:

```sh
npm install eslint-plugin-testids --save-dev
```

or local install

```
npm install --save ./plugins/eslint-custom-plugin
```

## Usage

In your [configuration file](https://eslint.org/docs/latest/use/configure/configuration-files#configuration-file), import the plugin `eslint-plugin-testids` and add `testids` to the `plugins` key:

```js
import testids from 'eslint-plugin-testids';

export default [
  {
    plugins: {
      testids,
    },
  },
];
```

Then configure the rules you want to use under the `rules` key.

```js
import testids from 'eslint-plugin-testids';

export default [
  {
    plugins: {
      testids,
    },
    rules: {
      'testids/rule-name': 'warn',
    },
  },
];
```

## Configurations

You can add what tags should it check just add settings to eslint config (If not provided it will use default config):

```json
"settings": {
  "tagsToCheck": {
    "button": "button",
    "select": "input",
    "input": "input",
    "customitem": "test"
  }
}
```

## Rules

```json
"plugins": [
  ...
  "eslint-plugin-testids"
],
"rules": {
  ...
  "testids/require-data-testid": "error", //this will check if data-testid is added
  "testids/validate-data-testid-format": "error", //this will check formatting (ad--button--test)
}
```
