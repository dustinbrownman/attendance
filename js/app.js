App = Ember.Application.create();

App.Router.map(function() {
  this.route('sign-in', { path: '/' });
  this.resource('attendances');
});

App.AttendancesRoute = Ember.Route.extend({
  model: function() {
    return this.store.find('attendance');
  }
});

App.SignInRoute = Ember.Route.extend({
  model: function() {
    return Ember.RSVP.hash({
      attendance: this.store.createRecord('attendance'),
      students: this.store.find('student')
    })
  }
})

App.SignInController = Ember.ObjectController.extend({
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

App.SignInView = Ember.View.extend({

});

App.dropDown = Ember.CollectionView.extend({
  classNames: ['list-group'],

  itemViewClass: Ember.View.extend({
    tagName: 'a',

    classNameBindings: ['selected:active'],

    classNames: ['list-group-item'],

    selected: function() {
      var content = this.get('content');
      var selectedItem = this.get('controller.content.selected');
      return content === selectedItem;
    }.property('controller.content.selected'),

    template: Ember.Handlebars.compile("{{view.content.name}}"),

    mouseEnter: function(event) {
      this.get('controller').send('select', this.get('content'));
    }
  }),
});

App.dropDownOption2 = Ember.CollectionView.extend({
  classNames: ['list-group'],

  selected: null,

  itemViewClass: Ember.View.extend({
    tagName: 'a',

    classNameBindings: ['selected:active'],

    classNames: ['list-group-item'],

    selected: function() {
      var content = this.get('content');
      var selectedItem = this.get('parentView.selected');
      return content === selectedItem;
    }.property('parentView.selected'),

    template: Ember.Handlebars.compile("{{view.content.name}}"),

    mouseEnter: function(event) {
      this.set('parentView.selected', this.get('content'));
      this.get('controller').set('model.attendance.student', this.get('content'));
    }
  }),
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
