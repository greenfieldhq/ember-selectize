import { moduleForComponent, test } from 'ember-qunit';
import { skip } from 'qunit';
import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';

const get = Ember.get;
const set = Ember.set;
const run = Ember.run;

const hasOption = function($el, label, value) {
  const selector = `[data-value="${value}"]:contains("${label}")`;
  return $el.find(selector).length > 0;
};

const findSelectedItems = function($el) {
  return $el.find('.selectize-input.items .item');
};

const findSelectedItem = function($el, value) {
  const $selectedItems = findSelectedItems($el);
  const $item = $selectedItems.filter(`[data-value="${value}"]`);

  return $item;
};

const hasSelectedItem = function($el, value) {
  return findSelectedItem($el, value).length > 0;
};

const hasSelectedItems = function($el, values) {
  return Ember.A(values).every((value) => hasSelectedItem($el, value));
};

const removeSelectedItem = function($el, value) {
  const $item = findSelectedItem($el, value);
  $item.find('.remove').click();
};

const findOptionByValue = function($el, value) {
  return $el.find(`.selectize-dropdown-content [data-value="${value}"]`);
};

moduleForComponent('x-selectize', 'Integration | Component | x selectize', {
  integration: true
});

test('options when content is an array of strings', function(assert) {
  assert.expect(4);

  this.render(hbs`
    {{x-selectize content=people value=person}}
  `);

  this.set('people', ['Eric', 'Dave', 'Wizard']);

  const $dropDownContent = this.$().find('.selectize-dropdown-content');

  assert.equal($dropDownContent.find('.option').length, 3, 'correct number of options displayed');
  assert.ok(hasOption($dropDownContent, 'Eric', 'Eric'), 'has option 1');
  assert.ok(hasOption($dropDownContent, 'Dave', 'Dave'), 'has option 2');
  assert.ok(hasOption($dropDownContent, 'Wizard', 'Wizard'), 'has option 3');
});

test('options when content is an array of objects', function(assert) {
  assert.expect(4);

  this.render(hbs`
    {{x-selectize content=people value=person optionLabelPath="name" optionValuePath="id"}}
  `);

  this.set('people', [
    { id: '1', name: 'Eric' },
    { id: '2', name: 'Dave' },
    { id: '3', name: 'Wizard' },
  ]);

  const $dropDownContent = this.$().find('.selectize-dropdown-content');

  assert.equal($dropDownContent.find('.option').length, 3, 'correct number of options displayed');
  assert.ok(hasOption($dropDownContent, 'Eric', 1), 'has option 1');
  assert.ok(hasOption($dropDownContent, 'Dave', 2), 'has option 2');
  assert.ok(hasOption($dropDownContent, 'Wizard', 3), 'has option 3');
});

// when multiple false

test('changing a value when content is array of strings', function(assert) {
  assert.expect(5);

  this.render(hbs`
    {{x-selectize value=person content=content}}
  `);

  this.set('content', ['Eric', 'Dave', 'Wizard']);

  this.set('person', 'Wizard');

  let $selectedItems = findSelectedItems(this.$());
  assert.equal($selectedItems.length, 1, 'correct number of selected items');
  assert.equal(hasSelectedItem(this.$(), 'Wizard'), true, 'has correct initial value');

  findOptionByValue(this.$(), 'Eric').click();

  let selectedPerson = get(this, 'person');
  assert.deepEqual(selectedPerson, 'Eric', 'eric is selected');

  findOptionByValue(this.$(), 'Dave').click();

  $selectedItems = findSelectedItems(this.$());
  assert.equal($selectedItems.length, 1, 'correct number of selected items');

  selectedPerson = get(this, 'person');
  assert.deepEqual(selectedPerson, 'Dave', 'dave is selected');
});

test('changing a value when content is array of objects', function(assert) {
  assert.expect(5);

  this.render(hbs`
    {{x-selectize value=person content=people optionLabelPath="name" optionValuePath="id"}}
  `);

  const eric = { id: '1', name: 'Eric' };
  const dave = { id: '2', name: 'Dave' };
  const wizard = { id: '3', name: 'Wizard' };

  this.set('people', [eric, dave, wizard]);
  this.set('person', '3');

  assert.equal(hasSelectedItem(this.$(), '3'), true, 'has correct initial value');

  findOptionByValue(this.$(), '1').click();

  let $selectedItems = findSelectedItems(this.$());
  assert.equal($selectedItems.length, 1, 'correct number of selected items');

  let selectedPerson = get(this, 'person');
  assert.deepEqual(selectedPerson, '1');

  findOptionByValue(this.$(), '2').click();

  $selectedItems = findSelectedItems(this.$());
  assert.equal($selectedItems.length, 1, 'correct number of selected items');

  selectedPerson = get(this, 'person');
  assert.deepEqual(selectedPerson, '2');
});

test('changing a selection when content is array of objects', function(assert) {
  assert.expect(5);

  this.render(hbs`
    {{x-selectize selection=person content=people optionLabelPath="name" optionValuePath="id"}}
  `);

  const eric = { id: '1', name: 'Eric' };
  const dave = { id: '2', name: 'Dave' };
  const wizard = { id: '3', name: 'Wizard' };

  this.set('people', [eric, dave, wizard]);
  this.set('person', wizard);

  assert.equal(hasSelectedItem(this.$(), '3'), true, 'has correct initial selection');

  findOptionByValue(this.$(), '1').click();

  let $selectedItems = findSelectedItems(this.$());
  assert.equal($selectedItems.length, 1, 'correct number of selected items');

  let selectedPerson = get(this, 'person');
  assert.deepEqual(selectedPerson, eric);

  findOptionByValue(this.$(), '2').click();

  $selectedItems = findSelectedItems(this.$());
  assert.equal($selectedItems.length, 1, 'correct number of selected items');

  selectedPerson = get(this, 'person');
  assert.deepEqual(selectedPerson, dave);
});

// when multiple true

test('multiple - changing a value when content is array of strings', function(assert) {
  assert.expect(7);

  this.render(hbs`
    {{x-selectize value=selectedPeople content=people multiple=true}}
  `);

  this.set('people', ['Eric', 'Dave', 'Wizard']);
  this.set('selectedPeople', ['Eric']);

  assert.equal(hasSelectedItems(this.$(), ['Eric']), true,
    'has correct initial selection');

  findOptionByValue(this.$(), 'Dave').click();

  assert.equal(hasSelectedItems(this.$(), ['Eric', 'Dave']), true,
    'item added to selectize items');

  let selectedPeople = get(this, 'selectedPeople');
  assert.deepEqual(selectedPeople, ['Eric', 'Dave'], 'item added to selection');

  findOptionByValue(this.$(), 'Wizard').click();

  assert.equal(hasSelectedItems(this.$(), ['Eric', 'Dave', 'Wizard']), true,
    'adds item to selection correctly');

  let $selectedItems = findSelectedItems(this.$());
  assert.equal($selectedItems.length, 3, 'correct number of selected items');

  selectedPeople = get(this, 'selectedPeople');
  assert.deepEqual(selectedPeople, ['Eric', 'Dave', 'Wizard']);

  removeSelectedItem(this.$(), 'Dave');

  selectedPeople = get(this, 'selectedPeople');
  assert.deepEqual(selectedPeople, ['Eric', 'Wizard'], 'option removed successfully');
});

test('multiple - changing a value when content is array of objects', function(assert) {
  assert.expect(5);

  this.render(hbs`
    {{x-selectize value=selectedPeople content=people optionLabelPath="name" optionValuePath="id" multiple=true}}
  `);

  const eric = { id: '1', name: 'Eric' };
  const dave = { id: '2', name: 'Dave' };
  const wizard = { id: '3', name: 'Wizard' };

  this.set('people', [eric, dave, wizard]);
  this.set('selectedPeople', [eric]);

  assert.equal(hasSelectedItems(this.$(), ['1']), true,
    'has correct initial selectize items');

  findOptionByValue(this.$(), '2').click();

  let $selectedItems = findSelectedItems(this.$());
  assert.equal($selectedItems.length, 2, 'correct number of selected items');

  assert.equal(hasSelectedItems(this.$(), ['1', '2']), true,
    'has correct initial selectize items');

  let selectedPeople = get(this, 'selectedPeople');
  assert.deepEqual(selectedPeople, ['1', '2'], 'eric and dave selected');

  removeSelectedItem(this.$(), '1');

  selectedPeople = get(this, 'selectedPeople');
  assert.deepEqual(selectedPeople, ['2'], 'option removed successfully');
});

test('multiple - changing a selection when content is array of objects', function(assert) {
  assert.expect(4);

  this.render(hbs`
    {{x-selectize selection=selectedPeople content=people optionLabelPath="name" optionValuePath="id" multiple=true}}
  `);

  const eric = { id: '1', name: 'Eric' };
  const dave = { id: '2', name: 'Dave' };
  const wizard = { id: '3', name: 'Wizard' };

  this.set('people', [eric, dave, wizard]);
  this.set('selectedPeople', [eric]);

  assert.equal(hasSelectedItems(this.$(), ['1']), true,
    'has correct initial selectize items');

  findOptionByValue(this.$(), '2').click();

  let $selectedItems = findSelectedItems(this.$());
  assert.equal($selectedItems.length, 2, 'correct number of selected items');

  let selectedPeople = get(this, 'selectedPeople');
  assert.deepEqual(selectedPeople, [eric, dave], 'eric and dave selected');

  removeSelectedItem(this.$(), '1');

  selectedPeople = get(this, 'selectedPeople');
  assert.deepEqual(selectedPeople, [dave], 'option removed successfully');
});

moduleForComponent('x-selectize', 'Unit | Component | x selectize', {
  unit: true
});

test('selectize instance is created when rendered', function(assert) {
  assert.expect(1);

  const component = this.subject();

  this.render();

  const selectize = get(component, '_selectize');
  assert.equal(selectize.isSetup, true, 'selectize is setup');
});

test('multiple attribute is bound', function(assert) {
  assert.expect(1);

  const component = this.subject();

  run(() => set(component, 'multiple', true));

  assert.equal(this.$().attr('multiple'), 'multiple');
});
