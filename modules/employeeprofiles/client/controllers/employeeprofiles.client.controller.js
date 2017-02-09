(function () {
  'use strict';

  // Employeeprofiles controller
  angular
    .module('employeeprofiles')
    .controller('EmployeeprofilesController', EmployeeprofilesController);

  EmployeeprofilesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'employeeprofileResolve'];

  function EmployeeprofilesController ($scope, $state, $window, Authentication, employeeprofile) {
    var vm = this;

    vm.authentication = Authentication;
    vm.employeeprofile = employeeprofile;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Employeeprofile
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.employeeprofile.$remove($state.go('employeeprofiles.list'));
      }
    }

    // Save Employeeprofile
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.employeeprofileForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.employeeprofile._id) {
        vm.employeeprofile.$update(successCallback, errorCallback);
      } else {
        vm.employeeprofile.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('employeeprofiles.view', {
          employeeprofileId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
