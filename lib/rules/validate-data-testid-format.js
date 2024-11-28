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

    const extractLocation = (node, start, end) => {
      const sourceCode = context.getSourceCode();
      const fullText = sourceCode.getText(node);

      const beforeStart = fullText.slice(0, start);
      const betweenStartEnd = fullText.slice(start, end);

      const startLines = beforeStart.split('\n');
      const betweenLines = betweenStartEnd.split('\n');

      const locStart = {
        line: node.loc.start.line + startLines.length - 1,
        column:
          startLines.length === 1
            ? node.loc.start.column + beforeStart.length
            : startLines[startLines.length - 1].length,
      };

      const locEnd = {
        line: locStart.line + betweenLines.length - 1,
        column:
          betweenLines.length === 1
            ? locStart.column + betweenStartEnd.length
            : betweenLines[betweenLines.length - 1].length,
      };

      return { start: locStart, end: locEnd };
    };

    return {
      TaggedTemplateExpression(node) {
        if (!node.quasi || node.tag.name !== 'html') {
          return;
        }

        const sourceCode = context.getSourceCode();
        const rawText = sourceCode.getText(node);

        Object.keys(tagsToCheck).forEach(tag => {
          const tagRegex = new RegExp(
            `<${tag}[^>]*\\bdata-testid="([^"]+)"`,
            'gs',
          );
          let match;

          while ((match = tagRegex.exec(rawText)) !== null) {
            const [fullMatch, testIdValue] = match;

            const attributeStart =
              match.index + fullMatch.indexOf('data-testid');
            const attributeEnd =
              attributeStart + `data-testid="${testIdValue}"`.length;

            const loc = extractLocation(node, attributeStart, attributeEnd);

            if (!testIdPattern.test(testIdValue)) {
              context.report({
                node,
                loc,
                messageId: 'invalidFormat',
              });
            } else {
              const [, itemName] = testIdValue.split('--');
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
        });
      },
    };
  },
};
