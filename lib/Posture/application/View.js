define(["Posture/Class", "Posture/behaviors/EventPublisher"], function(Posture) {
  
  var View = {
    
    Name: "application.View",
    
    Includes: [Posture.behaviors.EventPublisher],
    
    initialize: function initialize(config) {
      
    }.posture("hooks", "initialize")
    
  };
  
  Posture.Class.create(View, Posture);
  return Posture;
}, Posture);