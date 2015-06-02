import Ember from 'ember';
import layout from '../templates/components/x-selectize';

const computed = Ember.computed;
const get = Ember.get;
const isEmpty = Ember.isEmpty;
const on = Ember.on;
const run = Ember.run;
const set = Ember.set;

export default Ember.Component.extend({
  attributeBindings: ['multiple'],
  tagName: 'select',
  layout: layout,

  content: null,
  optionLabelPath: 'content.label',
  optionValuePath: 'content.value',
  multiple: false,
  _selectize: null,
  _options: [],

  didReceiveAttrs(attrs) {
    const content = attrs.newAttrs.content.value;

    if (content) {
      const options = this._buildOptions(content);
      run(() => set(this, '_options', options));
    }
  },

  didRender() {
    this._initSelectize();
    this._updateSelectizeOptions();
  },

  _initSelectize() {
    const settings = this._settingsForSelectize();
    this.$().selectize(settings);
    const selectize = this.$()[0].selectize;

    run(() => set(this, '_selectize', selectize));
  },

  _updateSelectizeOptions() {
    if (this._selectize) {
      const options = get(this, '_options');
      this._selectize.addOption(options);
      this._selectize.refreshOptions(false);
    }
  },

  _teardownSelectize: on('willDestroyElement', function() {
    const selectize = get(this, '_selectize');

    selectize.destroy();

    run(() => set(this, '_selectize', null));
  }),

  _settingsForSelectize() {
    return {
      plugins: ['remove_button'],
      labelField: 'label',
      valueField: 'value',
      onItemAdd: run.bind(this, '_onItemAdd'),
      onItemRemove: run.bind(this, '_onItemRemove')
    };
  },

  _onItemAdd(value) {
    this._addValue(value);
  },

  _onItemRemove(value) {
    this._removeValue(value);
  },

  _addValue(value) {
    const valuePath = this.attrs.optionValuePath;
    let newValue;

    if (valuePath) {
      const content = Ember.A(this.attrs.content.value);

      if (this.attrs.multiple) {
        if (this.attrs.value) {
          newValue = this._selectize.getValue();
        } else {
          const selectizeValues = Ember.A(this._selectize.getValue());
          newValue = content.filter((item) => {
            return selectizeValues.contains(get(item, valuePath));
          });
        }
      } else {
        if (this.attrs.value) {
          newValue = value;
        } else {
          newValue = content.findBy(valuePath, value);
        }
      }
    } else {
      if (this.attrs.multiple) {
        newValue = this._selectize.getValue();
      } else {
        newValue = value;
      }
    }

    if (this.attrs.value) {
      this.attrs.value.update(newValue);
    } else {
      this.attrs.selection.update(newValue);
    }
  },

  _removeValue() {
    const valuePath = this.attrs.optionValuePath;
    let newValue;

    if (valuePath) {
      if (this.attrs.multiple) {
        const content = Ember.A(this.attrs.content.value);
        const selectizeValues = Ember.A(this._selectize.getValue());

        if (this.attrs.value) {
          newValue = this._selectize.getValue();
        } else {
          newValue = content.filter((item) => {
            return selectizeValues.contains(get(item, valuePath));
          });
        }
      } else {
        newValue = null;
      }
    } else {
      if (this.attrs.multiple) {
        newValue = this._selectize.getValue();
      } else {
        newValue = null;
      }
    }

    if (this.attrs.value) {
      this.attrs.value.update(newValue);
    } else {
      this.attrs.selection.update(newValue);
    }
  },

  _buildOptions(content) {
    if (isEmpty(content)) {
      return [];
    } else {
      return content.map((item) => {
        return this._buildOption(item);
      });
    }
  },

  _buildOption(item) {
    if (typeof item === 'string') {
      return { label: item, value: item };
    } else {
      const label = get(item, this.attrs.optionLabelPath);
      const value = get(item, this.attrs.optionValuePath);

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
