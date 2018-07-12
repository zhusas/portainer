angular.module('portainer.app')
.controller('InitAdminController', ['$scope', '$state', '$sanitize', 'Notifications', 'Authentication', 'StateManager', 'UserService', 'EndpointService', 'EndpointProvider', 'ExtensionManager',
function ($scope, $state, $sanitize, Notifications, Authentication, StateManager, UserService, EndpointService, EndpointProvider, ExtensionManager) {

  $scope.logo = StateManager.getState().application.logo;

  $scope.formValues = {
    Username: 'admin',
    Password: '',
    ConfirmPassword: ''
  };

  $scope.state = {
    actionInProgress: false
  };

  $scope.createAdminUser = function() {
    var username = $sanitize($scope.formValues.Username);
    var password = $sanitize($scope.formValues.Password);

    $scope.state.actionInProgress = true;
    UserService.initAdministrator(username, password)
    .then(function success() {
      return Authentication.login(username, password);
    })
    .then(function success() {
      return EndpointService.endpoints();
    })
    .then(function success(data) {
      if (data.length === 0) {
        $state.go('portainer.init.endpoint');
      } else {
        var endpoint = data[0];
        endpointID = endpoint.Id;
        EndpointProvider.setEndpointID(endpointID);
        ExtensionManager.initEndpointExtensions(endpointID)
        .then(function success(data) {
          var extensions = data;
          return StateManager.updateEndpointState(false, endpoint.Type, extensions);
        })
        .then(function success() {
          $state.go('docker.dashboard');
        })
        .catch(function error(err) {
          Notifications.error('Failure', err, 'Unable to connect to Docker environment');
        });
      }
    })
    .catch(function error(err) {
      Notifications.error('Failure', err, 'Unable to create administrator user');
    })
    .finally(function final() {
      $scope.state.actionInProgress = false;
    });
  };

}]);
