export default Ember.ObjectController.extend({
  content: {
    selected: null
  },
  actions: {
    createAttendance: function() {
      var controller = this;
      var attendance = this.get('model.attendance');
      attendance.set('time', moment());
      attendance.save().then(function() {
        controller.transitionToRoute('attendances');
      });
    },
    select: function(student) {
      this.set('content.selected', student);
      this.set('model.attendance.student', student);
    }
  },
  filteredStudents: function() {
    var name = this.get('name');
    if (!name) { return; }

    var regex = new RegExp(name, 'i');
    return this.get('model.students').filter(function(student) {
      return regex.test(student.get('name'));
    });
  }.property('name')
});
