define(["Posture/elements/Element"], function(Posture) {
  var TableCell = {

    Name: "Posture.elements.TableCell",

    Extends: Posture.elements.Element,

    tagName: "td",

    classNames: ["table-cell"]
  };

  Posture.Class.create(TableCell, Posture);

  return Posture;
});