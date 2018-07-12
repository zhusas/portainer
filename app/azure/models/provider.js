function ContainerInstanceProviderViewModel(data) {
  this.Id = data.id;
  this.Namespace = data.namespace;

  var containerGroupType = _.find(data.resourceTypes, { 'resourceType': 'containerGroups' });
  this.Locations = containerGroupType.locations;
}
