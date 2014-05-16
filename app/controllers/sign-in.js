export default Ember.ObjectController.extend({
  content: {
    selected: null
  },
  actions: {
    createAttendance: function() {
      var studentName = this.get('name');
      this.store.find('student', { name: studentName })
      .then(function(fulfilledPromise) {
        var student = fulfilledPromise.get('firstObject');
        var attendance = fulfilledPromise.store.createRecord('attendance', {
          time: moment(),
          student: student
        });
        attendance.save();
      });
    },
    select: function(student) {
      this.set('content.selected', student);
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
