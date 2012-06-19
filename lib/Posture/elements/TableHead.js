define(["Posture/elements/Element", "Posture/elements/TableSection"], function(Posture) {

  var TableHead = {

    Name: "Posture.elements.TableHead",

    Extends: Posture.elements.TableSection,

    tagName: "thead",

    classNames: ["table-head"]

  };

  Posture.Class.create(TableHead, Posture);

  return Posture;
});