define(["Posture/Class", "Posture/behaviors/EventPublisher"], function(Posture) {

  var _ = Posture._, Application;

  Application = {

    Name: "Posture.Application",

    Includes: [Posture.behaviors.EventPublisher],

    getDefaultNamespaces: function getDefaultNamespaces() {
      return {
        components: new Posture.Namespace(),
        views: new Posture.Namespace(),
        models: new Posture.Namespace(),
        collections: new Posture.Namespace(),
        utils: new Posture.Namespace()
      };
    },

    initialize: function initialize(config) {
      _.extend(this, this.getDefaultNamespaces(), config);
    }

  };

  Posture.Class.create(Application, Posture);

  return Posture;

});