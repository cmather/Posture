define(["Posture/elements/TableSection"], function(Posture) {

  var TableBody = {

    Name: "Posture.elements.TableBody",

    Extends: Posture.elements.TableSection,

    tagName: "tbody",

    classNames: ["table-body"]
  };

  Posture.Class.create(TableBody, Posture);

  return Posture;
});