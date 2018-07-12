angular.module('portainer.docker').component('nodesDatatable', {
  templateUrl: 'app/docker/components/datatables/nodes-datatable/nodesDatatable.html',
  controller: 'GenericDatatableController',
  bindings: {
    titleText: '@',
    titleIcon: '@',
    dataset: '<',
    tableKey: '@',
    orderBy: '@',
    reverseOrder: '<',
    showTextFilter: '<',
    showIpAddressColumn: '<',
    accessToNodeDetails: '<'
  }
});
