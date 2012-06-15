define(["Posture/Core"], function(Posture) {

  var _ = Posture._;

  function inherit(Super, Child) {

    if (_.isUndefined(Super)) throw new Error("Posture.Class: You're trying to inherit from an undefined object. Are you sure you included the right files?");
    if (_.isUndefined(Child)) throw new Error("Posture.Class: You passed in an undefined Child to inherit.");

    function F() {}
    F.prototype = Super.prototype;
    Child.prototype = new F();
    Child.prototype.constructor = Child;
    Child.superclass = Super;
    return Child;
  }

  function getIncludedObjectProperties() {
    return _.exclude(this, "initialize", "constructor", "getType", "Includes", "Extends", "Name");
  }

  function PostureClassProperties() {
    var PostureClass = this;

    return {
      create: function create() {
        var value, object;
        function F() {}
        F.prototype = PostureClass.prototype;
        object = new F();
        value = PostureClass.apply(object, arguments) || object;
        return value;
      },

      extend: function extend(definition, context) {
        definition = definition || {};
        _.extend(definition, { Extends: PostureClass });
        return new Class(definition, context);
      },

      type: function type() {
        return "Class";
      },

      _meta: {
        includes: []
      },

      include: function include() {
        _.forEach(arguments, function doInclude(include) {
          var includedObject = _.isFunction(include) ? include.prototype : include;
          _.extend(PostureClass.prototype, getIncludedObjectProperties.call(includedObject));
          PostureClass._meta.includes.push(include);
        });

        return PostureClass;
      },

      ancestors: function ancestors() {
        var klasses = [], klass = this.superclass;

        while (klass && klass !== Function) {
          klasses.push(klass);
          klass = klass.superclass;
        }

        return klasses.reverse();
      }
    };
  }

  var postureClassPrototype = {
    type: function type() {
      return this._meta.type;
    },

    namespace: function namespace() {
      return this._meta.namespace;
    },

    include: function include(mixin) {
      var Class = this._meta.Class,
      classIncludes = Class && Class._meta.includes,
      included = this._meta.included,
      args = _.toArray(arguments).slice(1),
      includedObject;

      includedObject = _.isFunction(mixin) ? mixin.prototype : mixin;

      if (!_.contains(included, mixin)) {
        if (!_.contains(classIncludes, mixin)) {
          _.extend(this, getIncludedObjectProperties.call(includedObject));
        }

        if (includedObject.initialize) {
          includedObject.initialize.apply(this, args);
        }

        included.push(mixin);
      }
    },

    collectPrototypes: function collectPrototypes() {
      var prototypes = [], prototype = Object.getPrototypeOf(this);

      while (prototype) {
        prototypes.push(prototype);
        prototype = Object.getPrototypeOf(prototype);
      }

      return prototypes;
    },

    collectClasses: function collectClasses() {
      var klasses = [], klass = this._meta && this._meta.Class;

      while (klass && klass !== Function) {
        klasses.push(klass);
        klass = klass.superclass;
      }

      return klasses;
    },

    collectPrototypePropertyValues: function collectPrototypePropertyValues(property, direction) {
      var propertyValues = [];

      direction = direction || "up";

      if (_.has(this, property)) {
        if (_.isArray(this[property])) {
          propertyValues = propertyValues.concat(this[property]);
        }
        else {
          propertyValues.push(this[property]);
        }
      }

      _.forEach(this.collectPrototypes(), function(prototype) {
        if (_.has(prototype, property)) {
          if (_.isArray(prototype[property])) {
            propertyValues = propertyValues.concat(prototype[property]);
          }
          else {
            propertyValues.push(prototype[property]);
          }
        }
      });

      return direction === "up" ? propertyValues : propertyValues.reverse();
    },

    mergePrototypePropertyValues: function mergePrototypePropertyValues(initial, property) {
      var values = this.collectPrototypePropertyValues(property, "down"),
          result = {};

      _.forEach(values, function(value) {
        if (_.isObject(value)) _.extend(result, value);
      });

      if (initial) _.extend(result, initial);

      return result;
    }
  };

  var Class = function Class(definition, context) {

    var PostureClass, SuperClass, namespace = {}, classProperties, classPrototype;

    definition = definition || {};

    if (_.has(definition, "Name")) {
      namespace = Posture.createNamespace(definition.Name, null, context);
      delete definition.Name;
    }

    if (_.has(definition, "Extends")) {
      SuperClass = definition.Extends;
      delete definition.Extends;
    }

    PostureClass = function PostureClass() {
      var value, args = _.toArray(arguments), ancestors;

      this._meta = {
        namespace: namespace && namespace.namespace || "",
        type: namespace && namespace.type || typeof this,
        superClass: SuperClass,
        Class: PostureClass,
        included: []
      };

      _.forEach(PostureClass._meta.includes, function runInclude(include) {
        this.include.apply(this, [include].concat(args));
      }, this);

      value = this.initialize ? this.initialize.apply(this, arguments) : this;

      return value;
    };

    if (namespace.target && namespace.type) namespace.target[namespace.type] = PostureClass;

    if (SuperClass) {
      inherit(SuperClass, PostureClass);
    }

    /* gives PostureClass standard singleton methods like create and extend */
    _.extend(PostureClass, PostureClassProperties.call(PostureClass));

    /* Include ancestor mixins at class creation time */
    ancestors = PostureClass.ancestors();
    _.forEach(ancestors, function processAncestorIncludes(superclass) {
      if (superclass._meta && superclass._meta.includes) {
        PostureClass.include.apply(PostureClass, superclass._meta.includes);
      }
    });

    if (_.has(definition, "Includes")) {
      PostureClass.include.apply(PostureClass, definition.Includes);
      delete definition.Includes;
    }

    if (_.has(definition, "ClassProperties")) {
      _.extend(PostureClass, definition.ClassProperties);
      delete definition.ClassProperties;
    }

    /* extends the PostureClass.prototype with properties from the Class definition */
    _.extend(PostureClass.prototype, definition);

    /* extends the PostureClass.prototype with the standard prototype methods like type() and namespace() */
    _.extend(PostureClass.prototype, postureClassPrototype);

    /* gives PostureClass the methods defined on Class.prototype */
    _.extend(PostureClass, this);

    return PostureClass;

  };

  _.extend(Class, {

    create: function create(definition, context) {
      return new Class(definition, context);
    },

    type: function type() {
      return "Type";
    },

    _meta: {}

  });


  _.extend(Posture, {
    Class: Class
  });

  return Posture;
});