export function StoridgeProfileDefaultModel() {
  this.Directory = '/cio/';
  this.Capacity = 20;
  this.Redundancy = 2;
  this.Provisioning = 'thin';
  this.Type = 'ssd';
  this.MinIOPS = 100;
  this.MaxIOPS = 2000;
  this.MinBandwidth = 1;
  this.MaxBandwidth = 100;
}

export function StoridgeProfileListModel(data) {
  this.Name = data;
  this.Checked = false;
}

export function StoridgeProfileModel(name, data) {
  this.Name = name;
  this.Directory = data.directory;
  this.Capacity = data.capacity;
  this.Provisioning = data.provision;
  this.Type = data.type;
  this.Redundancy = data.level;

  if (data.iops) {
    this.MinIOPS = data.iops.min;
    this.MaxIOPS = data.iops.max;
  }

  if (data.bandwidth) {
    this.MinBandwidth = data.bandwidth.min;
    this.MaxBandwidth = data.bandwidth.max;
  }
}

export function StoridgeCreateProfileRequest(model) {
  this.name = model.Name;
  this.capacity = model.Capacity;
  this.directory = model.Directory;
  this.provision = model.Provisioning;
  this.type = model.Type;
  this.level = model.Redundancy;
  if (model.MinIOPS && model.MaxIOPS) {
    this.iops = {
      min: model.MinIOPS,
      max: model.MaxIOPS
    };
  }

  if (model.MinBandwidth && model.MaxBandwidth) {
    this.bandwidth = {
      min: model.MinBandwidth,
      max: model.MaxBandwidth
    };
  }
}
