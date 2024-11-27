/**
 * @fileoverview Index for all rules
 * @author szymonb
 */
'use strict';

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------

module.exports.rules = {
  'require-data-testid': require('./rules/require-data-testid'),
  'validate-data-testid-format': require('./rules/validate-data-testid-format'),
};
