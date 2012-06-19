define(["Posture/elements/Element", "Posture/elements/TableRow"], function(Posture) {

  var TableSection = {

    Name: "Posture.elements.TableSection",

    Extends: Posture.elements.Element,

    childDefaults: {
      factory: Posture.elements.TableRow
    },

    findRow: function findRow(id) {
      return _.find(this.children, function find(row) {
        return row.id === id;
      });
    },

    insertRow: function insertRow(config) {
      return this.addChild(config);
    }.posture("hooks", "insertRow"),

    deleteRow: function deleteRow(index) {
      var row = this.children[index];
      return this.removeChild(row);
    }.posture("hooks", "deleteRow"),

    deleteRowById: function deleteRowById(id) {
      return this.deleteRow( this.children.indexOf(this.findRow(id)) );
    }
  };

  Posture.Class.create(TableSection, Posture);

  return Posture;
});