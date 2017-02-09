'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Checkin = mongoose.model('Checkin'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Checkin
 */
exports.create = function(req, res) {
  var checkin = new Checkin(req.body);
  checkin.user = req.user;

  checkin.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(checkin);
    }
  });
};

/**
 * Show the current Checkin
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var checkin = req.checkin ? req.checkin.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  checkin.isCurrentUserOwner = req.user && checkin.user && checkin.user._id.toString() === req.user._id.toString();

  res.jsonp(checkin);
};

/**
 * Update a Checkin
 */
exports.update = function(req, res) {
  var checkin = req.checkin;

  checkin = _.extend(checkin, req.body);

  checkin.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(checkin);
    }
  });
};

/**
 * Delete an Checkin
 */
exports.delete = function(req, res) {
  var checkin = req.checkin;

  checkin.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(checkin);
    }
  });
};

/**
 * List of Checkins
 */
exports.list = function(req, res) {
  Checkin.find().sort('-created').populate('user', 'displayName').exec(function(err, checkins) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(checkins);
    }
  });
};

/**
 * Checkin middleware
 */
exports.checkinByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Checkin is invalid'
    });
  }

  Checkin.findById(id).populate('user', 'displayName').exec(function (err, checkin) {
    if (err) {
      return next(err);
    } else if (!checkin) {
      return res.status(404).send({
        message: 'No Checkin with that identifier has been found'
      });
    }
    req.checkin = checkin;
    next();
  });
};
