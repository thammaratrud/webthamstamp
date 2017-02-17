'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Leave Schema
 */
var LeaveSchema = new Schema({
  email: {
    type: String,
    required: 'Please fill email',
  },
  leaveType: String,
  leaveDetail: String,
  leaveStartDateTime: Date,
  leaveEndDateTime: Date,
  leaveHalf: Boolean,
  leaveTime: Number,
  approveStatus: String,
  leaveStatus: String,
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Leave', LeaveSchema);
