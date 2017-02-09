// Employeeprofiles service used to communicate Employeeprofiles REST endpoints
(function () {
  'use strict';

  angular
    .module('employeeprofiles')
    .factory('EmployeeprofilesService', EmployeeprofilesService);

  EmployeeprofilesService.$inject = ['$resource'];

  function EmployeeprofilesService($resource) {
    return $resource('api/employeeprofiles/:employeeprofileId', {
      employeeprofileId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
