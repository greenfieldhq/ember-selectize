import { moduleForComponent, test } from 'ember-qunit';
import { skip } from 'qunit';
import Ember from 'ember';

const get = Ember.get;
const set = Ember.set;
const run = Ember.run;

moduleForComponent('x-selectize', 'Unit | Component | x selectize', {
  // Specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar'],
  unit: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Creates the component instance
  var component = this.subject();
  assert.equal(component._state, 'preRender');

  // Renders the component to the page
  this.render();
  assert.equal(component._state, 'inDOM');
});

test('selectize instance is created when rendered', function(assert) {
  assert.expect(1);

  const component = this.subject();

  this.render();

  const selectize = get(component, '_selectize');
  assert.equal(selectize.isSetup, true, 'selectize is setup');
});

// options

test('options when content is an array of strings', function(assert) {
  assert.expect(2);

  const component = this.subject();

  let expectedOptions = [];
  let options = get(component, '_options');
  assert.deepEqual(options, expectedOptions,
    'initial options are empty');


  const content = ['Eric', 'Dave', 'Wizard'];

  run(() => {
    set(component, 'content', content);
  });

  expectedOptions = [
    { label: 'Eric', value: 'Eric' },
    { label: 'Dave', value: 'Dave' },
    { label: 'Wizard', value: 'Wizard' }
  ];
  options = get(component, '_options');
  assert.deepEqual(options, expectedOptions,
    'options are updated when content changes');
});

test('options when content is an array of objects', function(assert) {
  assert.expect(2);

  const component = this.subject();

  let expectedOptions = [];
  let options = get(component, '_options');
  assert.deepEqual(options, expectedOptions,
    'initial options are empty');

  const content = [
    { id: 1, name: 'Eric' },
    { id: 2, name: 'Dave' },
    { id: 3, name: 'Wizard' },
  ];

  run(() => {
    set(component, 'content', content);
    set(component, 'optionLabelPath', 'content.name');
    set(component, 'optionValuePath', 'content.id');
  });

  expectedOptions = [
    { label: 'Eric', value: 1 },
    { label: 'Dave', value: 2 },
    { label: 'Wizard', value: 3 }
  ];
  options = get(component, '_options');
  assert.deepEqual(options, expectedOptions,
    'options are updated when content changes');
});

// when multiple false

test('value w/ strings as content');
skip('value w/ objects as content w/ optionValuePath & optionLabelPath');
skip('value w/ objects as content w/o optionValuePath & optionLabelPath'); // says to use them both

skip('selection w/ strings as content'); // says to use value
skip('selection w/ objects as content w/ optionValuePath & optionLabelPath');
skip('selection w/ objects as content w/o optionValuePath & optionLabelPath'); // says to use them both

// when multiple true

skip('value w/ strings as content');
skip('value w/ objects as content w/ optionValuePath & optionLabelPath');
skip('value w/ objects as content w/o optionValuePath & optionLabelPath'); // says to use them both

skip('selection w/ strings as content'); // says to use value
skip('selection w/ objects as content w/ optionValuePath & optionLabelPath');
skip('selection w/ objects as content w/o optionValuePath & optionLabelPath'); // says to use them both
skip('selection w/ objects as content bound to hasMany');
