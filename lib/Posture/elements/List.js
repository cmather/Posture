define(["Posture/elements/Element", "Posture/elements/ListItem"], function(Posture) {

  var List = {

    Name: "Posture.elements.List",

    Extends: Posture.element.Element,

    tagName: "ul",

    classNames: ["list"],

    childDefaults: {
      factory: Posture.elements.ListItem
    }
  };

  Posture.Class.create(List, Posture);

  return Posture;

});