import Ember from 'ember';

const postAttrs = [
  { id: "1", title: "The best post ever" },
  { id: "2", title: "The next best post" },
  { id: "3", title: "The worst post ever written" }
];

const commentAttrs = [
  { id: "1", body: "The best comment ever" },
  { id: "2", body: "The next best comment" },
  { id: "3", body: "The worst comment ever written" },
  { id: "4", body: "comment 4" },
  { id: "5", body: "comment 5" },
  { id: "6", body: "comment 6" },
  { id: "7", body: "comment 7" }
];

export default Ember.Route.extend({
  beforeModel() {
    this._buildPosts();
    this._buildComments();
  },

  model() {
    return Ember.RSVP.hash({
      posts: this.store.all('post'),
      comments: this.store.all('comment'),
      newPost: this.store.createRecord('post'),
      newComment: this.store.createRecord('comment')
    });
  },

  _buildPosts() {
    return postAttrs.map((attrs) => {
      return this.store.createRecord('post', attrs);
    });
  },

  _buildComments() {
    return commentAttrs.map((attrs) => {
      return this.store.createRecord('comment', attrs);
    });
  }
});
