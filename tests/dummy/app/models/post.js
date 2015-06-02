import DS from 'ember-data';

const attr    = DS.attr;
const hasMany = DS.hasMany;

export default DS.Model.extend({
  comments: hasMany('comment', { async: true }),

  title: attr('string')
});
