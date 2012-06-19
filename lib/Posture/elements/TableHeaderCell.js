define(["Posture/elements/TableCell"], function(Posture) {

  var TableHeaderCell = {

    Name: "Posture.elements.TableHeaderCell",

    Extends: Posture.elements.TableCell,

    tagName: "th"

  };

  Posture.Class.create(TableHeaderCell, Posture);

  return Posture;
});