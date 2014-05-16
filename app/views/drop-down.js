export default Ember.CollectionView.extend({
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
