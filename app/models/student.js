var Student = DS.Model.extend({
  name: DS.attr('string'),
  attendances: DS.hasMany('attendance', { async: true })
});

Student.reopenClass({
  FIXTURES: [
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
});

export default Student;
