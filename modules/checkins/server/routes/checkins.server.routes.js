'use strict';

/**
 * Module dependencies
 */
var checkinsPolicy = require('../policies/checkins.server.policy'),
  checkins = require('../controllers/checkins.server.controller');

module.exports = function(app) {
  // Checkins Routes
  app.route('/api/checkins').all(checkinsPolicy.isAllowed)
    .get(checkins.list)
    .post(checkins.create);

  app.route('/api/checkins/:checkinId').all(checkinsPolicy.isAllowed)
    .get(checkins.read)
    .put(checkins.update)
    .delete(checkins.delete);

  // Finish by binding the Checkin middleware
  app.param('checkinId', checkins.checkinByID);
};
