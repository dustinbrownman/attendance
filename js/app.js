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
    return  this.store.find('student');
  }
})

App.SignInController = Ember.ObjectController.extend({
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
    },
    sayHello: function() {
      alert('hello');
    }
  },
  filteredStudents: function() {
    var name = this.get('name');
    if (!name) { return; }

    var regex = new RegExp(name, 'i');
    return this.get('model').filter(function(student) {
      return regex.test(student.get('name'));
    });
  }.property('name')
});

App.SignInView = Ember.View.extend({
  mouseEnter: function(event) {
    this.controller.send('sayHello');
  }
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

// App.Autocomplete = Ember.ContainerView.extend({
//   content: null,
//   value: null,
//   valuePath: '',
//   selected: null,

//   isDropdownVisible: false,

//   template: Ember.Handlebars.compile('{{view.content}}'),
//   classNames: 'autocomplete',
//   childViews: ['inputView', 'dropdownView'],
//   emptyView: null,

//   inputView: Ember.TextField.extend({
//     value: function(key, value) {
//       var parentView = this.get('parentView'),
//           valuePath;

//       if (arguments.length === 2) {
//         return value;
//       } else {
//         valuePath = parentView.get('valuePath').replace(/^content\.?/, '');
//         if (valuePath) { valuePath = '.' + valuePath; }

//         return parentView.get('value' + valuePath);
//       }
//     }.property('parentView.value', 'parentView.valuePath'),

//     keyUp: function(e) {
//       var parentView = this.get('parentView');

//       // Only trigger search when it's not a special key. Having this
//       // triggered when value changes gives us false positives as to
//       // the user's true intensions.
//       if (!parentView.constructor.KEY_EVENTS[e.keyCode]) {
//         parentView.trigger('search', this.get('value'));
//       }
//     }
//   }),

//   dropdownView: Ember.CollectionView.extend({
//     classNames: 'dropdown',
//     tagName: 'ul',

//     contentBinding: 'parentView.content',
//     selectedBinding: 'parentView.selected',
//     templateBinding: 'parentView.template',
//     isVisibleBinding: 'parentView.isDropdownVisible',
//     emptyViewBinding: 'parentView.emptyView',

//     itemViewClass: Ember.View.extend({
//       tagName: 'li',
//       templateBinding: 'parentView.template',
//       classNameBindings: ['selected'],

//       selected: function() {
//         var content = this.get('content'),
//             value = this.get('parentView.selected');

//         return content === value;
//       }.property('parentView.selected'),

//       click: function() {
//         var parentView = this.get('parentView.parentView'),
//             content = this.get('content');

//         if (parentView) {
//           parentView.trigger('select', content);
//         }
//       }
//     })
//   }),

//   keyDown: function(e) {
//     var map = this.constructor.KEY_EVENTS,
//         method = map[e.keyCode];

//     if (method && Ember.typeOf(this[method]) === 'function') {
//       e.preventDefault();
//       this[method](e);
//     }
//   },

//   focusIn: function() {
//     this.show();
//   },

//   focusOut: function() {
//     setTimeout(Ember.$.proxy(this, 'hide'), 200);
//   },

//   select: function(value) {
//     this.set('value', value).hide();
//   },

//   search: function(term) {
//     var controller = this.get('controller');

//     if (term) {
//       controller.send('search', term, this);
//     }
//   },

//   confirm: function() {
//     var selected = this.get('selected');
//     this.select(selected);
//   },

//   clear: function() {
//     this.setProperties({
//       value: null,
//       selected: null
//     }).hide();
//   },

//   next: function() {
//     return this._move(+1, this.get('content.firstObject'));
//   },

//   prev: function() {
//     return this._move(-1, this.get('content.lastObject'));
//   },

//   show: function() {
//     this.set('isDropdownVisible', true);
//     return this;
//   },

//   hide: function() {
//     this.set('isDropdownVisible', false);
//     return this;
//   },

//   _move: function(dir, def) {
//     var selected = this.get('selected'),
//         content = this.get('content'),
//         index = content.indexOf(selected);

//     if (index !== -1) {
//       selected = content.objectAt(index + dir);
//     } else {
//       selected = def;
//     }

//     this.set('selected', selected).show();

//     return selected;
//   },

//   contentDidChange: function() {
//     this.show();
//   }.observes('content')
// });

// App.Autocomplete.KEY_EVENTS = {
//   38: 'prev',
//   40: 'next',
//   27: 'clear',
//   13: 'confirm'
// };

// AutocompleteController = Ember.Controller.extend({
//   search: function(term, context) {
//     var results = [
//       Ember.Object.create({name: 'Bison'}),
//       Ember.Object.create({name: 'Vega'}),
//     ];
//     context.set('content', results);
//   }
// });
