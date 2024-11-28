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
    const tagsToCheck =
      context.settings.tagsToCheck || require('../config/tagsConfig.js');

    const calculateExactLocation = (text, baseLoc, matchIndex) => {
      const lines = text.slice(0, matchIndex).split('\n');
      const lastLineLength = lines[lines.length - 1].length;

      return {
        line: baseLoc.start.line + lines.length - 1,
        column:
          lines.length === 1
            ? baseLoc.start.column + lastLineLength
            : lastLineLength,
      };
    };

    return {
      TaggedTemplateExpression(node) {
        if (node.tag.name !== 'html' || !node.quasi) return;

        const sourceCode = context.getSourceCode();
        const fullText = sourceCode.getText(node);
        const baseLoc = node.loc;

        Object.keys(tagsToCheck).forEach(tag => {
          const tagRegex = new RegExp(`<${tag}[^>]*>`, 'g');
          let match;

          while ((match = tagRegex.exec(fullText)) !== null) {
            const testIdRegex = new RegExp(`data-testid="([^"]*)"`);
            const testIdMatch = testIdRegex.exec(match[0]);

            if (!testIdMatch) {
              const startLoc = calculateExactLocation(
                fullText,
                baseLoc,
                match.index,
              );

              context.report({
                node,
                loc: {
                  start: startLoc,
                  end: {
                    line: startLoc.line,
                    column: startLoc.column + match[0].length,
                  },
                },
                messageId: 'missingDataTestId',
                data: { tag },
              });
            }
          }
        });
      },
    };
  },
};
