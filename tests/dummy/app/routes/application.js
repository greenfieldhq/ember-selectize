import Ember from 'ember';

const postAttrs = [
  { id: "1", title: "The best post ever" },
  { id: "2", title: "The next best post" },
  { id: "3", title: "The worst post ever written" }
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
    const comments = [];

    for (let i = 0; i < 300; i ++) {
     const comment = this.store.createRecord('comment', {
        id: i.toString(),
        body: `Awesome comment #${i}`
      });

      comments.push(comment);
    }

    return comments;
  }
});
