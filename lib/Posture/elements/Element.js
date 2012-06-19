define(["Posture/Component"], function(Posture) {

  var Element = {

    Name: "Posture.elements.Element",

    Extends: Posture.Component,

    domEvents: ["click"]

  };

  Posture.Class.create(Element, Posture);

  return Posture;

});