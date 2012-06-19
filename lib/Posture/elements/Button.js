define(["Posture/elements/Element"], function(Posture) {
  var Button = {

    Name: "Posture.elements.Button",

    Extends: Posture.elements.Element,

    tagName: "button",

    classNames: ["button"]

  };

  Posture.Class.create(Button, Posture);

  return Posture;
});