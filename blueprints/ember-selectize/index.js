module.exports = {
  description: ''

  afterInstall(options) {
    return this.addBowerPackageToProject('selectize');
  }
};
