define(["Posture/elements/Element"], function(Posture) {
  var TableCaption = {

    Name: "Posture.elements.TableCaption",

    Extends: Posture.elements.Element,

    tagName: "caption",

    classNames: ["caption"]
  };

  Posture.Class.create(TableCaption, Posture);

  return Posture;

});