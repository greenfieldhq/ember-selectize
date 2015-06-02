import DS from 'ember-data';

const attr    = DS.attr;
const belongsTo = DS.belongsTo;

export default DS.Model.extend({
  post: belongsTo('post', { async: true }),

  body: attr('string')
});
