/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-selectize',

  included(app) {
    this._super.included(app);

    app.import(`${app.bowerDirectory}/selectize/dist/js/standalone/selectize.js`);
  }
};
