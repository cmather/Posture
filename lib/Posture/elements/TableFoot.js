define(["Posture/elements/Element", "Posture/elements/TableSection"], function(Posture) {

  var TableFoot = {

    Name: "Posture.elements.TableFoot",

    Extends: Posture.elements.TableSection,

    tagName: "tfoot",

    classNames: ["table-foot"]

  };

  Posture.Class.create(TableFoot, Posture);

  return Posture;
});