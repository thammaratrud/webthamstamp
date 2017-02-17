'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Employeeprofile Schema
 */
var EmployeeprofileSchema = new Schema({
 email: {
        type: String,
        required: 'Please fill email',
    },
    officeAddress: String,
    jobTitle: String,
    Line: String,
    image: String,
    firstName: String,
    lastName: String,
    Tel: String,
    Facebook: String,
    deviceId:String,
    platform:String,
    pincode:String,
    userName:String,
    mobile:String,
    ascCode:String,
    departmentCode:String,
    groupLocation:String,
    locationCode:String,
    positionByJob:String,
    sectionCode:String,

  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Employeeprofile', EmployeeprofileSchema);
