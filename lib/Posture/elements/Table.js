define(["Posture/elements/Element", "Posture/elements/TableCaption", "Posture/elements/TableHead", "Posture/elements/TableBody", "Posture/elements/TableFoot"], function(Posture) {

  var Table = {

    Name: "Posture.elements.Table",

    Extends: Posture.elements.Element,

    tagName: "table",

    classNames: ["table"],

    onBeforeProcessChildren: function onBeforeProcessChildren() {

      if (this.config.caption) {
        this.createCaption(this.config.caption);
      }

      if (this.config.tHead) {
        this.createTHead(this.config.tHead);
      }

      if (this.config.tFoot) {
        this.createTFoot(this.config.tFoot);
      }

      var configTBodies = this.config.tBodies;
      this.tBodies = [];
      _.forEach(configTBodies, _.bind(this.createTBody, this));

    },

    onBeforeRenderChildren: function onBeforeRenderChildren() {
      var tbody = _.find(this.children, function findTBody(child) {
        return child.tagName === "tbody";
      });

      if (!tbody) {
        this.createTBody();
      }
    },

    tBodyIndexOffset: function tBodyIndexOffset() {
      var offset = 0;
      if (this.caption) offset += 1;
      if (this.tHead) offset += 1;
      if (this.tFoot) offset += 1;
      return offset;
    },

    indexForBody: function indexForBody(index) {
      index = _.isUndefined(index) || _.isNull(index) ? this.tBodies.length : index;
      index += this.tBodyIndexOffset();

      if ( index > this.children.length ) index = this.children.length;
      else if ( index < 0 ) index = 0;

      return index;
    },

    findTBody: function findTBody(id) {
      return _.find(this.tBodies, function find(tbody) {
        return tbody.id === id;
      });
    },

    createTBody: function createTbody(config) {
      var tbody;
      config = config || {};
      _.extend(config, { factory: Posture.elements.TableBody });
      config.index = this.indexForBody(config.index);
      tbody = this.addChild(config);
      this.tBodies.push(tbody);
      return tbody;
    }.posture("hooks", "createTBody"),

    deleteTBody: function deleteTBody(index) {
      var tbody = this.tBodies[index];

      if (tbody) {
        tbody.remove();
        this.tBodies.splice(index, 1);
        return true;
      }

      return false;

    }.posture("hooks", "deleteTBody"),

    deleteTBodyById: function deleteTBodyById(id) {
      var index, tbody;

      tbody = _.find(this.tBodies, function findTBody(tbody) {
        return tbody.id === id;
      });

      if (tbody) {
        index = this.tBodies.indexOf(tbody);
        return this.deleteTBody(index);
      }

      return false;
    },

    insertRow: function insertRow(config, tBodyId) {
      var tbody = tBodyId ? this.findTBody(tBodyId) : this.tBodies[0];
      if (!tbody) throw new Error(this.type() + ": Couldn't find a tbody with id of " + tBodyId);
      return tbody.insertRow(config);
    }.posture("hooks", "insertRow"),

    deleteRow: function deleteRow(index, tBodyId) {
      var tbody = tBodyId ? this.findTBody(tBodyId) : this.tBodies[0];
      if (!tbody) throw new Error(this.type() + ": Couldnt find a tbody with id of " + tBodyId);
      return tbody.deleteRow(index);
    }.posture("hooks", "deleteRow"),

    deleteRowById: function deleteRowById(id, tBodyId) {
      var tbody = tBodyId ? this.findTBody(tBodyId) : this.tBodies[0];
      if (!tbody) throw new Error(this.type() + ": Couldnt find a tbody with id of " + tBodyId);
      return tbody.deleteRowById(id);
    },

    createTHead: function createTHead(config) {
      var index;
      if (this.tHead) return this.tHead;
      config = config || {};
      index = this.caption ? 1 : 0;
      _.extend(config, { index: index, factory: Posture.elements.TableHead });
      this.tHead = this.addChild(config);
      return this.tHead;
    }.posture("hooks", "createTHead"),

    deleteTHead: function deleteTHead() {
      var thead = this.tHead;

      if (thead) {
        this.tHead.remove();
        this.tHead = null;
        return true;
      }

      return false;

    }.posture("hooks", "deleteTHead"),

    createTFoot: function createTFoot(config) {
      var index;
      if (this.tFoot) return this.tFoot;
      config = config || {};
      if (this.tHead) index = this.children.indexOf(this.tHead) + 1;
      else if (this.caption) index = 1;
      else index = 0;
      _.extend(config, {index: index, factory: Posture.elements.TableFoot });
      this.tFoot = this.addChild(config);
      return this.tFoot;
    }.posture("hooks", "createTFoot"),

    deleteTFoot: function deleteTFoot() {
      var tfoot = this.tFoot;

      if (tfoot) {
        this.tFoot.remove();
        this.tFoot = null;
        return true;
      }

      return false;
    }.posture("hooks", "deleteTFoot"),

    createCaption: function createCaption(config) {
      var index = 0;

      if (this.caption) return this.caption;

      config = config || {};
      _.extend(config, { index: index, factory: Posture.elements.TableCaption });
      this.caption = this.addChild(config);
      return this.caption;
    }.posture("hooks", "createCaption"),

    deleteCaption: function deleteCaption() {
      var caption = this.caption;

      if (caption) {
        this.caption.remove();
        this.caption = null;
        return true;
      }

      return false;
    }.posture("hooks", "deleteCaption")
  };

  Posture.Class.create(Table, Posture);

  return Posture;

});