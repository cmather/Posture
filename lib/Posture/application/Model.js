define(["Posture/Class", "Posture/behaviors/EventPublisher", "Posture/behaviors/Configurable"], function(Posture) {
  
  var Model = {
    
    Name: "application.Model",
    
    Includes: [Posture.behaviors.EventPublisher],
    
    initialize: function initialize(model) {
      this.attributes = model || {};
    },
    
    get: function get(key) {
      
    },
    
    set: function set(key, value, options) {
      
      
      this.trigger("changed:"+key, value, this);
    },
    
    toJSON: function toJSON() {
      
    },
    
    toFormParams: function toFormParams() {
      
    },
    
    toObject: function toObject() {
      return _.clone(this.attributes);
    }
    
  };
  
  Posture.Class.create(Model, Posture);
  
  return Posture;
  
});