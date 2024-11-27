/**
 * @fileoverview Ensures all specified tags have a `data-testid` attribute.
 * @author szymonb
 */
'use strict';

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Ensure all specified tags have a `data-testid` attribute.',
      recommended: false,
    },
    schema: [],
    messages: {
      missingDataTestId:
        "The <{{tag}}> tag is missing a 'data-testid' attribute.",
    },
  },

  create(context) {
    // Załaduj konfigurację tags z pliku
    const tagsToCheck =
      context.settings.tagsToCheck || require('../config/tagsConfig.js');

    return {
      TaggedTemplateExpression(node) {
        if (node.tag.name === 'html' && node.quasi) {
          const rawValue = node.quasi.quasis
            .map(quasi => quasi.value.raw)
            .join('');

          // Iteracja po wszystkich tagach z tagsConfig (użycie Object.keys)
          Object.keys(tagsToCheck).forEach(tag => {
            const regex = new RegExp(`<${tag}[^>]*>`, 'g');
            let match;

            while ((match = regex.exec(rawValue)) !== null) {
              // Dopasowanie pozycji dla lokalizacji w kodzie
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

              // Sprawdzenie, czy tag ma przypisany 'data-testid'
              if (!testIdMatch) {
                context.report({
                  node,
                  loc,
                  messageId: 'missingDataTestId',
                  data: { tag },
                });
              }
            }
          });
        }
      },
    };
  },
};
