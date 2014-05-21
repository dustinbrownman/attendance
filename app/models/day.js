var Day = DS.Model.extend({
  name: DS.attr('string'),
  attendances: DS.hasMany('attendance', { async: true })
});

Day.FIXTURES = [
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
];

export default Day;
