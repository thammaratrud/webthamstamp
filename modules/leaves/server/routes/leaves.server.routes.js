'use strict';

/**
 * Module dependencies
 */
var leavesPolicy = require('../policies/leaves.server.policy'),
  leaves = require('../controllers/leaves.server.controller');

module.exports = function(app) {
  // Leaves Routes
  app.route('/api/leaves').all(leavesPolicy.isAllowed)
    .get(leaves.list)
    .post(leaves.create);

  app.route('/api/leaves/:leaveId').all(leavesPolicy.isAllowed)
    .get(leaves.read)
    .put(leaves.update)
    .delete(leaves.delete);

  // Finish by binding the Leave middleware
  app.param('leaveId', leaves.leaveByID);
};
