define(["Posture/elements/Element"], function(Posture) {

  var ListItem = {

    Name: "Posture.elements.ListItem",

    Extends: Posture.elements.Element,

    tagName: "li",

    classNames: ["list-item"]
  };

  Posture.Class.create(ListItem, Posture);

  return Posture;

});