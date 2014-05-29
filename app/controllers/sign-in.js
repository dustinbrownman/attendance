export default Ember.ObjectController.extend({
  needs: ['flashMessage'],
  content: {
    selected: null
  },
  actions: {
    createAttendance: function() {
      var controller = this;
      var flashMessage = this.get('controllers.flashMessage');
      var attendance = this.get('model.attendance');
      attendance.set('time', moment());
      attendance.save().then(function(attendance) {
        flashMessage.set('message', 'Welcome ' + attendance.get('student.name') + '. Thanks for checking in.');
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
