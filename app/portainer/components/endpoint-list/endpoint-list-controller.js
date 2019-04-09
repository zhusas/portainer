import _ from 'lodash-es';

angular.module('portainer.app').controller('EndpointListController', ['DatatableService',
  function EndpointListController(DatatableService) {
    var ctrl = this;
    ctrl.state = {
      textFilter: '',
      filteredEndpoints: []
    };

    ctrl.$onChanges = $onChanges;
    ctrl.onTextFilterChange = onTextFilterChange;
    ctrl.$onInit = $onInit 

    function $onChanges(changesObj) {
      handleEndpointsChange(changesObj.endpoints);
    }

    function handleEndpointsChange(endpoints) {
      if (!endpoints) {
        return;
      }
      if (!endpoints.currentValue) {
        return;
      }

      onTextFilterChange();
    }

    function onTextFilterChange() {
      var filterValue = ctrl.state.textFilter;
      ctrl.state.filteredEndpoints = filterEndpoints(
        ctrl.endpoints,
        filterValue
      );
      DatatableService.setDataTableTextFilters(ctrl.tableKey, filterValue);
    }

    function filterEndpoints(endpoints, filterValue) {
      if (!endpoints || !endpoints.length || !filterValue) {
        return endpoints;
      }
      var keywords = filterValue.split(' ');
      return _.filter(endpoints, function(endpoint) {
        var statusString = convertStatusToString(endpoint.Status);
        return _.every(keywords, function(keyword) {
          var lowerCaseKeyword = keyword.toLowerCase();
          return (
            _.includes(endpoint.Name.toLowerCase(), lowerCaseKeyword) ||
            _.includes(endpoint.GroupName.toLowerCase(), lowerCaseKeyword) ||
            _.includes(endpoint.URL.toLowerCase(), lowerCaseKeyword) ||
            _.some(endpoint.Tags, function(tag) {
              return _.includes(tag.toLowerCase(), lowerCaseKeyword);
            }) ||
            _.includes(statusString, keyword)
          );
        });
      });
    }

    function convertStatusToString(status) {
      return status === 1 ? 'up' : 'down';
    }

    function $onInit() {
      var textFilter = DatatableService.getDataTableTextFilters(ctrl.tableKey);
      if (textFilter !== null) {
        ctrl.state.textFilter = textFilter;
        onTextFilterChange();
      }
    }
  }
]);
