'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Leave = mongoose.model('Leave'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Leave
 */
exports.create = function(req, res) {
  var leave = new Leave(req.body);
  leave.user = req.user;

  leave.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(leave);
    }
  });
};

/**
 * Show the current Leave
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var leave = req.leave ? req.leave.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  leave.isCurrentUserOwner = req.user && leave.user && leave.user._id.toString() === req.user._id.toString();

  res.jsonp(leave);
};

/**
 * Update a Leave
 */
exports.update = function(req, res) {
  var leave = req.leave;

  leave = _.extend(leave, req.body);

  leave.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(leave);
    }
  });
};

/**
 * Delete an Leave
 */
exports.delete = function(req, res) {
  var leave = req.leave;

  leave.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(leave);
    }
  });
};

/**
 * List of Leaves
 */
exports.list = function(req, res) {
  Leave.find().sort('-created').populate('user', 'displayName').exec(function(err, leaves) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(leaves);
    }
  });
};

/**
 * Leave middleware
 */
exports.leaveByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Leave is invalid'
    });
  }

  Leave.findById(id).populate('user', 'displayName').exec(function (err, leave) {
    if (err) {
      return next(err);
    } else if (!leave) {
      return res.status(404).send({
        message: 'No Leave with that identifier has been found'
      });
    }
    req.leave = leave;
    next();
  });
};
