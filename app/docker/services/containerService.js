angular.module('portainer.docker')
.factory('ContainerService', ['$q', 'Container', 'ResourceControlService', 'LogHelper',
function ContainerServiceFactory($q, Container, ResourceControlService, LogHelper) {
  'use strict';
  var service = {};

  service.container = function(id) {
    var deferred = $q.defer();

    Container.get({ id: id }).$promise
    .then(function success(data) {
      var container = new ContainerDetailsViewModel(data);
      deferred.resolve(container);
    })
    .catch(function error(err) {
      deferred.reject({ msg: 'Unable to retrieve container information', err: err });
    });

    return deferred.promise;
  };

  service.containers = function(all, filters) {
    var deferred = $q.defer();
    Container.query({ all : all, filters: filters }).$promise
    .then(function success(data) {
      var containers = data.map(function (item) {
        return new ContainerViewModel(item);
      });
      deferred.resolve(containers);
    })
    .catch(function error(err) {
      deferred.reject({ msg: 'Unable to retrieve containers', err: err });
    });

    return deferred.promise;
  };

  service.startContainer = function(id) {
    return Container.start({ id: id }, {}).$promise;
  };

  service.stopContainer = function(id) {
    return Container.stop({ id: id }, {}).$promise;
  };

  service.restartContainer = function(id) {
    return Container.restart({ id: id }, {}).$promise;
  };

  service.killContainer = function(id) {
    return Container.kill({ id: id }, {}).$promise;
  };

  service.pauseContainer = function(id) {
    return Container.pause({ id: id }, {}).$promise;
  };

  service.resumeContainer = function(id) {
    return Container.unpause({ id: id }, {}).$promise;
  };

  service.renameContainer = function(id, newContainerName) {
    return Container.rename({id: id, name: newContainerName }, {}).$promise;
  };

  service.createContainer = function(configuration) {
    var deferred = $q.defer();
    Container.create(configuration).$promise
    .then(function success(data) {
      if (data.message) {
        deferred.reject({ msg: data.message });
      } else {
        deferred.resolve(data);
      }
    })
    .catch(function error(err) {
      deferred.reject({ msg: 'Unable to create container', err: err });
    });
    return deferred.promise;
  };

  service.createAndStartContainer = function(configuration) {
    var deferred = $q.defer();
    var containerID;
    service.createContainer(configuration)
    .then(function success(data) {
      containerID = data.Id;
      return service.startContainer(containerID);
    })
    .then(function success() {
      deferred.resolve({ Id: containerID });
    })
    .catch(function error(err) {
      deferred.reject(err);
    });
    return deferred.promise;
  };

  service.remove = function(container, removeVolumes) {
    var deferred = $q.defer();

    Container.remove({ id: container.Id, v: (removeVolumes) ? 1 : 0, force: true }).$promise
    .then(function success(data) {
      if (data.message) {
        deferred.reject({ msg: data.message, err: data.message });
      }
      if (container.ResourceControl && container.ResourceControl.Type === 1) {
        return ResourceControlService.deleteResourceControl(container.ResourceControl.Id);
      }
    })
    .then(function success() {
      deferred.resolve();
    })
    .catch(function error(err) {
      deferred.reject({ msg: 'Unable to remove container', err: err });
    });

    return deferred.promise;
  };

  service.createExec = function(execConfig) {
    var deferred = $q.defer();

    Container.exec({}, execConfig).$promise
    .then(function success(data) {
      if (data.message) {
        deferred.reject({ msg: data.message, err: data.message });
      } else {
        deferred.resolve(data);
      }
    })
    .catch(function error(err) {
      deferred.reject(err);
    });

    return deferred.promise;
  };

  service.logs = function(id, stdout, stderr, timestamps, tail, stripHeaders) {
    var deferred = $q.defer();

    var parameters = {
      id: id,
      stdout: stdout || 0,
      stderr: stderr || 0,
      timestamps: timestamps || 0,
      tail: tail || 'all'
    };

    Container.logs(parameters).$promise
    .then(function success(data) {
      var logs = LogHelper.formatLogs(data.logs, stripHeaders);
      deferred.resolve(logs);
    })
    .catch(function error(err) {
      deferred.reject(err);
    });

    return deferred.promise;
  };

  service.containerStats = function(id) {
    var deferred = $q.defer();

    Container.stats({ id: id }).$promise
    .then(function success(data) {
      var containerStats = new ContainerStatsViewModel(data);
      deferred.resolve(containerStats);
    })
    .catch(function error(err) {
      deferred.reject(err);
    });

    return deferred.promise;
  };

  service.containerTop = function(id) {
    return Container.top({ id: id }).$promise;
  };

  service.inspect = function(id) {
    return Container.inspect({ id: id }).$promise;
  };

  return service;
}]);
