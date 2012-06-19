define(["Posture/elements/Element"], function(Posture) {

  var Anchor = {

    Name: "Posture.elements.Anchor",

    Extends: Posture.element.Element,

    tagName: "a",

    classNames: ["anchor"],

    attributes: {
      href: ""
    }
  };

  Posture.Class.create(Anchor, Posture);

  return Posture;

});