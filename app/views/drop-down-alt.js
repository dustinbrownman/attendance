export default Ember.CollectionView.extend({
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
