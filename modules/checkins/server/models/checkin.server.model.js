'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Checkin Schema
 */
var CheckinSchema = new Schema({
  email: {
    type: String,
    required: 'Please fill email',
  },
  dateTimeIn: Date,
  dateTimeOut: Date,
  locationIn: String,
  locationOut: String,
  status: String,
  description: String,
  img: String,
  firstName: String,
  lastName: String,
  Lat: String,
  Long: String,
  remark: {
    in: String,
    out: String
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Checkin', CheckinSchema);
