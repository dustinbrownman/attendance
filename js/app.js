App = Ember.Application.create();

App.Router.map(function() {
  this.route('new_attendance', { path: '/' });
  this.resource('attendances');
});

App.AttendancesRoute = Ember.Route.extend({
  model: function() {
    return this.store.find('attendance');
  }
})

App.NewAttendanceController = Ember.ObjectController.extend({
  content: {},
  actions: {
    createAttendance: function() {
      var studentName = this.get('name');
      alert(studentName);
      this.store.find('student', { name: studentName })
      .then(function(fullfilledPromise) {
        var student = fullfilledPromise.get('firstObject');
        var attendance = fullfilledPromise.store.createRecord('attendance', {
          time: moment(),
          student: student
        });
        attendance.save();
      });
    }
  }
})

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
