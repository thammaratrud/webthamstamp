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
exports.create = function (req, res) {
  var checkin = new Checkin(req.body);
  checkin.user = req.user;

  checkin.save(function (err) {
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
exports.read = function (req, res) {
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
exports.update = function (req, res) {
  var checkin = req.checkin;

  checkin = _.extend(checkin, req.body);

  checkin.save(function (err) {
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
exports.delete = function (req, res) {
  var checkin = req.checkin;

  checkin.remove(function (err) {
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
exports.list = function (req, res) {
  Checkin.find().sort('-created').populate('user', 'displayName','profileImageURL').exec(function (err, checkins) {
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
exports.checkinByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Checkin is invalid'
    });
  }

  Checkin.findById(id).populate('user', 'displayName','profileImageURL').exec(function (err, checkin) {
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

exports.userById = function (req, res, next, userid) {
  var status = '';
  Checkin.find().populate('user', 'displayName','profileImageURL').exec(function (err, users) {
    if (err) {
      return next(err);
    } else if (!users) {
      return res.status(404).send({
        message: 'No Checkin with that identifier has been found'
      });
    }
    var all = [];
    for (var i = 0; i < users.length; i++) {
      if (users[i].user) {
        console.log(users[i].user._id.toString() === userid.toString());
        if (users[i].user._id.toString() === userid.toString()) {
          if (users[i].dateTimeIn) {
            var dateObj = new Date();
            var month = dateObj.getUTCMonth() + 1; //months from 1-12
            var day = dateObj.getUTCDate();
            var year = dateObj.getUTCFullYear();
            var monthCheck = users[i].dateTimeIn.getUTCMonth() + 1;
            var dayCheck = users[i].dateTimeIn.getUTCDate();
            var yearCheck = users[i].dateTimeIn.getUTCFullYear();
            // newdate = year + "/" + month + "/" + day;
            if (day === dayCheck && month === monthCheck && year === yearCheck) {

              if (users[i].dateTimeOut) {
                status = 'checkined today';

              } else {
                status = 'checkin only';
              }
            } else {
              status = 'Not checkin';
            }
          } else {
            status = 'Not checkin';
          }
          // all.push(users[i]);
        }
      }
    }

    req.status = { status: status };
    next();
  });
};

exports.userid = function (req, res) {
  res.jsonp(req.status);

};
