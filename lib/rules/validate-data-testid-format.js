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

    const testIdPattern = /^([a-z0-9-]+)--([a-z0-9-]+)(--\${([a-z0-9-]+)})?$/;

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

              // Sprawdzamy, czy testIdMatch jest prawidłowe (czy nie jest null)
              if (testIdMatch) {
                // Sprawdzamy, czy format 'data-testid' jest zgodny
                if (!testIdPattern.test(testIdMatch[1])) {
                  context.report({
                    node,
                    loc,
                    messageId: 'invalidFormat',
                  });
                } else {
                  const [, itemName] = testIdMatch[1].split('--');
                  const expectedItemName = tagsToCheck[tag];
                  // Sprawdzamy, czy drugi fragment odpowiada oczekiwanemu typowi
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
              } else {
                // Jeżeli nie znaleziono 'data-testid', zgłaszamy błąd
              }
            }
          });
        }
      },
    };
  },
};
