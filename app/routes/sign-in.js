export default Ember.Route.extend({
  model: function() {
    return Ember.RSVP.hash({
      attendance: this.store.createRecord('attendance'),
      students: this.store.find('student')
    });
  }
});
