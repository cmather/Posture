define(["Posture/Core"], function(Posture) {

  var _ = Posture._;

  function inherit(Super, Child) {

    if (_.isUndefined(Super)) throw new Error("Posture.Class: You're trying to inherit from an undefined object. Are you sure you included the right files?");
    if (_.isUndefined(Child)) throw new Error("Posture.Class: You passed in an undefined Child to inherit.");

    function F() {};
    F.prototype = Super.prototype;
    Child.prototype = new F();
    Child.prototype.constructor = Child;
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
        function F() {};
        F.prototype = PostureClass.prototype;
        object = new F();
        value = PostureClass.apply(object, arguments) || object;
        return value;
      },

      extend: function extend(definition, context) {
        definition || (definition = {});
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

      var includedObject = _.isFunction(mixin) ? mixin.prototype : mixin;

      if (!_.contains(included, mixin)) {
        if (!_.contains(classIncludes, mixin)) {
          _.extend(this, getIncludedObjectProperties.call(includedObject));
        }

        if (includedObject.initialize) {
          includedObject.initialize.apply(this, args);
        }
        
        included.push(mixin);
      }
    }
  };

  var Class = function Class(definition, context) {

    var PostureClass, SuperClass, namespace = {}, classProperties, classPrototype;

    definition || (definition = {});

    if (_.has(definition, "Name")) {
      namespace = Posture.createNamespace(definition.Name, null, context)
      delete definition.Name;
    }

    if (_.has(definition, "Extends")) {
      SuperClass = definition.Extends;      
      delete definition.Extends;
    }

    PostureClass = function PostureClass() {
      var value, args = _.toArray(arguments);

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
      return "Type"
    },

    _meta: {}

  });


  _.extend(Posture, {
    Class: Class
  });

  return Posture;
});