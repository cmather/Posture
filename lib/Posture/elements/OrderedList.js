define(["Posture/elements/List"], function(Posture) {
  var OrderedList = {

    Name: "Posture.elements.OrderedList",

    Extends: Posture.element.List,

    tagName: "ol"
  };

  Posture.Class.create(OrderedList, Posture);

  return Posture;

});