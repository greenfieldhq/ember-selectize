import Ember from 'ember';
import layout from '../templates/components/x-selectize';

const computed = Ember.computed;
const get = Ember.get;
const isArray = Ember.isArray;
const isEmpty = Ember.isEmpty;
const on = Ember.on;
const run = Ember.run;
const set = Ember.set;

export default Ember.Component.extend({
  attributeBindings: ['multiple'],
  tagName: 'select',
  layout: layout,

  content: null,
  optionLabelPath: 'content',
  optionValuePath: 'content',
  multiple: false,
  _selectize: null,
  _options: [],
  _value: null,

  didReceiveAttrs(attrs) {
    const content = attrs.newAttrs.content.value;
    const value = attrs.newAttrs.value;
    const selection = attrs.newAttrs.selection;

    if (content) {
      const options = this._buildOptions(content);
      set(this, '_options', options);
    }

    if (value) {
      set(this, '_value', value.value);
    }

    if (selection) {
      set(this, '_selection', selection.value);
    }
  },

  didRender() {
    this._initSelectize();
    this._updateSelectizeOptions();
    this._updateSelectizeItems();
  },

  _initSelectize() {
    const settings = this._settingsForSelectize();
    this.$().selectize(settings);
    const selectize = this.$()[0].selectize;

    set(this, '_selectize', selectize);
  },

  _teardownSelectize: on('willDestroyElement', function() {
    const selectize = get(this, '_selectize');

    selectize.destroy();

    set(this, '_selectize', null);
  }),

  _updateSelectizeOptions() {
    if (this._selectize) {
      const options = get(this, '_options');

      this._selectize.addOption(options);
      this._selectize.refreshOptions(false);
    }
  },

  _updateSelectizeItems() {
    const value = get(this, '_value');
    const selection = get(this, '_selection');
    const valuePath = get(this, '_valuePath');
    const multiple = get(this, 'multiple');

    if (value) {
      if (valuePath) {
        if (isArray(value)) {
          value.forEach((obj) => {
            this._selectize.addItem(get(obj, valuePath));
          });
        } else {
          this._selectize.addItem(value);
        }
      } else {
        this._selectize.addItem(value);
      }
    }

    if (selection) {
      if (isArray(selection)) {
        selection.forEach((obj) => {
          this._selectize.addItem(get(obj, valuePath));
        });
      } else {
        this._selectize.addItem(get(selection, valuePath));
      }
    }
  },

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
