var ApplicationRoute = Ember.Route.extend({
  actions: {
    closeFlashMessage: function() {
      this.flashMessage('').now();
    }
  }
});

export default ApplicationRoute;
