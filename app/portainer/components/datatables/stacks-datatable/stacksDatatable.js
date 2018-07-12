angular.module('portainer.app').component('stacksDatatable', {
  templateUrl: 'app/portainer/components/datatables/stacks-datatable/stacksDatatable.html',
  controller: 'StacksDatatableController',
  bindings: {
    titleText: '@',
    titleIcon: '@',
    dataset: '<',
    tableKey: '@',
    orderBy: '@',
    reverseOrder: '<',
    showTextFilter: '<',
    showOwnershipColumn: '<',
    removeAction: '<'
  }
});
