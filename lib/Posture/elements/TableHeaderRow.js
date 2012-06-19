define(["Posture/elements/TableRow"], function(Posture) {

  var TableHeaderRow = {

    Name: "Posture.elements.TableHeaderRow",

    Extends: Posture.elements.TableRow,

    childDefaults: {
      factory: Posture.elements.TableHeaderCell
    }

  };

  Posture.Class.create(TableHeaderRow, Posture);

  return Posture;
});