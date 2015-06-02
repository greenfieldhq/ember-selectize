import Ember from 'ember';
import layout from '../templates/components/x-selectize';

const computed = Ember.computed;
const get = Ember.get;
const isEmpty = Ember.isEmpty;

export default Ember.Component.extend({
  layout: layout,

  content: null,
  optionLabelPath: 'content',
  optionValuePath: 'content',

  _options: computed('content.[]', function() {
    const content = get(this, 'content');

    if (isEmpty(content)) {
      return [];
    } else {
      return content.map((item) => {
        return this._buildOption(item);
      });
    }
  }),

  _buildOption(item) {
    if (typeof item === 'string') {
      return { label: item, value: item };
    } else {
      const labelPath = get(this, '_labelPath');
      const valuePath = get(this, '_valuePath');
      const label = get(item, labelPath);
      const value = get(item, valuePath);

      return { label: label, value: value };
    }
  },

  _labelPath: computed('optionLabelPath', function() {
    return get(this, 'optionLabelPath').replace(/^content\.?/, '');
  }),

  _valuePath: computed('optionValuePath', function() {
    return get(this, 'optionValuePath').replace(/^content\.?/, '');
  })
});
