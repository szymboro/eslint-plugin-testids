/**
 * @fileoverview Validates the format of `data-testid` attributes.
 * @author szymonb
 */
'use strict';

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Validate the format of `data-testid` attributes.',
      recommended: false,
    },
    schema: [],
    messages: {
      invalidFormat:
        "The 'data-testid' must follow the format: componentname--tagname--value (e.g., add--text--interestrates).",
      invalidItemName:
        "The second part of 'data-testid' for <{{tag}}> must match its type (expected: '{{expected}}', found: '{{actual}}').",
    },
  },

  create(context) {
    const tagsToCheck =
      context.settings.tagsToCheck || require('../config/tagsConfig.js');

    const testIdPattern =
      context.settings.testIdPattern ||
      require('../config/regexConfig.js').testIdPattern;

    return {
      TaggedTemplateExpression(node) {
        if (node.tag.name === 'html' && node.quasi) {
          const rawValue = node.quasi.quasis
            .map(quasi => quasi.value.raw)
            .join('');

          Object.keys(tagsToCheck).forEach(tag => {
            const regex = new RegExp(`<${tag}[^>]*>`, 'g');
            let match;

            while ((match = regex.exec(rawValue)) !== null) {
              const startIndex = match.index;
              const endIndex = startIndex + match[0].length;

              const testIdRegex = new RegExp(
                `<${tag}[^>]*data-testid="([^"]+)"`,
              );
              const testIdMatch = testIdRegex.exec(match[0]);

              const loc = {
                start: {
                  line:
                    node.loc.start.line +
                    rawValue.slice(0, startIndex).split('\n').length -
                    1,
                  column: rawValue.slice(0, startIndex).split('\n').pop()
                    .length,
                },
                end: {
                  line:
                    node.loc.start.line +
                    rawValue.slice(0, endIndex).split('\n').length -
                    1,
                  column: rawValue.slice(0, endIndex).split('\n').pop().length,
                },
              };

              let regexTag = /([a-zA-Z0-9-]+)/;
              let matchedTag = testIdMatch[0].match(regexTag);

              if (matchedTag[0] == tag) {
                if (testIdMatch) {
                  if (!testIdPattern.test(testIdMatch[1])) {
                    context.report({
                      node,
                      loc,
                      messageId: 'invalidFormat',
                    });
                  } else {
                    const [, itemName] = testIdMatch[1].split('--');
                    const expectedItemName = tagsToCheck[tag];
                    if (itemName !== expectedItemName) {
                      context.report({
                        node,
                        loc,
                        messageId: 'invalidItemName',
                        data: {
                          tag,
                          expected: expectedItemName,
                          actual: itemName,
                        },
                      });
                    }
                  }
                }
              }
            }
          });
        }
      },
    };
  },
};
