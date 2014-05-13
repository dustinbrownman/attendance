App = Ember.Application.create();

App.Router.map(function() {
  this.route('new_attendance', { path: '/' });
  this.resource('attendances');
});

App.AttendancesRoute = Ember.Route.extend({
  model: function() {
    return this.store.find('attendance');
  }
});

App.NewAttendanceRoute = Ember.Route.extend({
  model: function() {
    return Ember.RSVP.hash({
      students: this.store.find('student')
    });
  }
})

App.NewAttendanceController = Ember.ObjectController.extend({
  content: {},
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
    }
  },
  filteredStudents: function() {
    var name = this.get('name');
    if (!name) { return; }

    var regex = new RegExp(name, 'i');
    return this.get('model.students').filter(function(student) {
      return regex.test(student.get('name'));
    });
  }.property('name', 'content.@each.name')
});

App.Student = DS.Model.extend({
  name: DS.attr('string'),
  attendances: DS.hasMany('attendance', { async: true })
});

App.Attendance = DS.Model.extend({
  student: DS.belongsTo('student', { async: true }),
  time: DS.attr('string'),
  day: DS.belongsTo('day', { async: true }),
  formattedTime: function() {
    return moment(this.get('time')).format('LL');
  }.property('time')
});

App.Day = DS.Model.extend({
  name: DS.attr('string'),
  attendances: DS.hasMany('attendance', { async: true })
})

App.ApplicationAdapter = DS.FixtureAdapter.extend({
  queryFixtures: function(records, query, type) {
    return records.filter(function(record) {
        for(var key in query) {
            if (!query.hasOwnProperty(key)) { continue; }
            var value = query[key];
            if (record[key] !== value) { return false; }
        }
        return true;
    });
  }
});

App.Student.FIXTURES = [
  {
    id: 1,
    name: 'John Smith'
  },
  {
    id: 2,
    name: 'Jane Doe'
  },
  {
    id: 3,
    name: 'Derek Swaney'
  },
  {
    id: 4,
    name: 'Sally Johnson'
  },
  {
    id: 5,
    name: 'Sarah'
  }
]

App.Attendance.FIXTURES = [
  {
    id: 1,
    time: moment(),
    student: 1
  }
]

App.Day.FIXTURES = [
  {
    id: 1,
    name: 'Sunday'
  },
  {
    id: 2,
    name: 'Monday'
  },
  {
    id: 3,
    name: 'Tuesday'
  },
  {
    id: 4,
    name: 'Wednesday'
  },
  {
    id: 5,
    name: 'Thursday'
  }
]
