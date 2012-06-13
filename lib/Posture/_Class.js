define(["Posture/Type"], function(Posture) {  
  var _ = Posture._;

  function ClassProperties() {
    var ClassInstance = this, properties;
    
    properties = {
      extend: function extend(definition) {
        definition ? definition : (definition = {});
        _.extend(definition, { Extends: ClassInstance });
        return new Class(definition);
      }
    };
    
    return properties;
  }

  function InstanceProperties() {
    var ClassInstance = this, properties;
    
    properties = {
      extend: function extend() {
        return _.extend.apply(this, [this].concat(arguments));
      },
      include: function include() {
        _(arguments).forEach(doInclude, this);
        runIncludes.call(this, null, _.toArray(arguments));
        return this;
      }
    };
    
    return properties;
  }
  
  function getIncludeObject() {
    return _.exclude(this, "initialize", "included", "constructor", "getType", "Includes", "Extends", "Name");
  }
  
  function doInclude(include) {
    var object = this, target;
    if(!include) throw new Error(object.getType() + ": You're trying to include an object that hasn't been defined. Are you sure you included the right file on the page?");
    object._meta.includes || (object._meta.includes = []);
    
    if (_.contains(object._meta.includes, include)) return;
    
    object._meta.includes.push(include);
    
    include = _.isFunction(include) ? include.prototype : include;
    target = _.isFunction(object) ? object.prototype : object;
    
    _.extend(target, getIncludeObject.call(include));
    
    return target;
  }
  
  function runIncludes(args, includes) {
    var object = this, included;
    
    if (!includes) return;
    
    included = object._meta.included || (object._meta.included = []);
    
    _.forEach(includes, function runInclude(include) {
      
      included.push(include);
      
      if (_.isFunction(include)) include = include.prototype;
  
      if (include.initialize) {
        include.initialize.apply(this, args);
      }
      
    }, this);
  }
  

  var Class = new Posture.Type("Class", function(definition, context) {
    var namespace = {}, includes, ClassInstance;
    
    definition || (definition = {});
    
    if ( _.has(definition, "Name") ) {
      namespace = Posture.createNamespace(definition.Name, null, context);
      delete definition.Name;
    }
    
    function ClassConstructor() {
      var retVal = this, MyClass = this._meta.Class;

      runIncludes.call(this, _.toArray(arguments), MyClass._meta.includes);

      if (this.initialize) {
        this.initialize.apply(this, arguments);
      }
    }

    ClassInstance = new Posture.Type(namespace.type, ClassConstructor);
    
    _.extend(ClassInstance, this);
    
    if ( _.has(definition, "Extends" ) ) {
      function Prototype() {};
      Prototype.prototype = definition.Extends.prototype;
      ClassInstance.prototype = new Prototype();
      ClassInstance.prototype.constructor = ClassInstance;
      ClassInstance._meta.SuperClass = definition.Extends;
      ClassInstance.prototype._meta.SuperClass = definition.Extends;
      delete definition.Extends;
    }
    
    includes = ClassInstance._meta.includes = [];
    
    if ( _.has(definition, "Includes") ) {
      _(definition.Includes).forEach(doInclude, ClassInstance);
      delete definition.Includes;
    }
    
    _.extend(ClassInstance, ClassProperties.call(ClassInstance));
    _.extend(ClassInstance.prototype, InstanceProperties.call(ClassInstance));
    _.extend(ClassInstance.prototype, definition);
    ClassInstance.prototype._meta.Class = ClassInstance;
    
    if (namespace.target && namespace.type) namespace.target[namespace.type] = ClassInstance;
    
    return ClassInstance;
  });

  _.extend(Posture, {
    Class: Class
  });

  return Posture;

});