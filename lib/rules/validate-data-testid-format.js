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

    const removeInterpolations = str => {
      return str.replace(/\${[^}]*}/g, '');
    };

    const calculateLoc = (
      startLine,
      startColumn,
      text,
      startIndex,
      endIndex,
    ) => {
      const beforeStart = text.slice(0, startIndex);
      const beforeEnd = text.slice(0, endIndex);

      const startLines = beforeStart.split('\n');
      const endLines = beforeEnd.split('\n');

      return {
        start: {
          line: startLine + startLines.length - 1,
          column:
            startLines.length === 1
              ? startColumn + beforeStart.length
              : startLines[startLines.length - 1].length,
        },
        end: {
          line: startLine + endLines.length - 1,
          column:
            endLines.length === 1
              ? startColumn + beforeEnd.length
              : endLines[endLines.length - 1].length,
        },
      };
    };

    return {
      TaggedTemplateExpression(node) {
        if (!node.tag || !node.quasi || node.tag.name !== 'html') {
          return;
        }

        let rawValue = node.quasi.quasis.map(quasi => quasi.value.raw).join('');

        rawValue = removeInterpolations(rawValue);

        Object.keys(tagsToCheck).forEach(tag => {
          const regex = new RegExp(`<${tag}[^>]*>`, 'g');
          let match;

          while ((match = regex.exec(rawValue)) !== null) {
            if (!match[0]) {
              continue;
            }

            const startIndex = match.index;

            const testIdRegex = new RegExp(
              `<${tag}[^>]*\\bdata-testid="([^"]+)"`,
            );
            const testIdMatch = testIdRegex.exec(match[0]);

            if (!testIdMatch || !testIdMatch[1]) {
              continue;
            }

            const testIdFull = `data-testid="${testIdMatch[1]}"`;
            const testIdStart = startIndex + match[0].indexOf(testIdFull);
            const testIdEnd = testIdStart + testIdFull.length;

            if (!node.loc) {
              continue;
            }

            const loc = calculateLoc(
              node.loc.start.line,
              node.loc.start.column,
              rawValue,
              testIdStart,
              testIdEnd,
            );

            let regexTag = /([a-zA-Z0-9-]+)/;
            let matchedTag = testIdMatch[0].match(regexTag);

            if (matchedTag && matchedTag[0] === tag) {
              if (!testIdPattern.test(testIdMatch[1])) {
                context.report({
                  node,
                  loc,
                  messageId: 'invalidFormat',
                });
              } else {
                const [, itemName] = testIdMatch[1].split('--');
                const expectedItemName = tagsToCheck[tag];
                if (expectedItemName && itemName !== expectedItemName) {
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
        });
      },
    };
  },
};
