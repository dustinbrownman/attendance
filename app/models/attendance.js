var Attendance = DS.Model.extend({
  student: DS.belongsTo('student', { async: true }),
  time: DS.attr('string'),
  day: DS.belongsTo('day', { async: true }),
  formattedTime: function() {
    return moment(this.get('time')).format('LL');
  }.property('time')
});

Attendance.FIXTURES = [
  {
    id: 1,
    time: moment(),
    student: 1
  }
];

export default Attendance;
