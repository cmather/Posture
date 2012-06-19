define(["Posture/elements/Element", "Posture/elements/TableCell"], function(Posture) {

  var TableRow = {

    Name: "Posture.elements.TableRow",

    Extends: Posture.elements.Element,

    tagName: "tr",

    childDefaults: {
      factory: Posture.elements.TableCell
    }

  };

  Posture.Class.create(TableRow, Posture);

  return Posture;

});
