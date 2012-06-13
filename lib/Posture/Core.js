define(function(require) {
  var _ = require("../vendor/lodash");
  
  var root = window || global;
  
  var slice = Array.prototype.slice;
  
  function Namespace(properties) {
    if (this.__proto__) this.__proto__ = null;
    _.extend(this, properties);
  }
  
  function createNamespace(namespace, object, context) {
    var names = namespace.split("."), type, name;
    
    context ? context : (context = window || global);
    
    type = names.pop();
    
    while (name = names.shift()) {
      context[name] = context[name] || new Namespace();
      context = context[name];
    }
    
    if (object) {
      context[type] = object;
      context = object;
    }
    else {
      context[type] = new Namespace();
    }
    
    return {
      target: context,
      namespace: namespace,
      type: type
    };
  }
  
  function emptyFn() {}
  
  _.mixin({
    exclude: function exclude(object) {
      var target = {}, properties = _.toArray(arguments).slice(1), property;
      
      function filter(key) {
        return !_.contains(properties, key);
      }
      _.chain(object).keys().filter( filter ).forEach(function(key) {
        target[key] = object[key];
      });
      return target;
    },
    
    capitalize: function(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
  });
  
  /**
    * The main `Posture` namespace.
    *
    * @api public
  */
  var Posture = new Namespace({
    version: "0.0.1",
    _: _,
    $: jQuery,
    Namespace: Namespace,
    createNamespace: createNamespace,
    emptyFn: emptyFn,
    natives: new Namespace({
      Function: new Namespace(),
      Array: new Namespace(),
      Number: new Namespace(),
      String: new Namespace()
    })
  });
  
  _.forEach(["Function", "Array", "Number", "String"], function(name) {

    root[name].prototype.posture = function posture (method) {
      if (!Posture.natives[name]) throw new Error("Couldn't find a namespace in Posture.natives for '" + name + "'");
      if (!Posture.natives[name][method]) throw new Error("Couldn't find a method named '" + method + "' in Posture.natives." + name);
      return Posture.natives[name][method].apply(this, slice.call(arguments, 1));
    };

  });
  
  _.extend(Posture.natives.Function, {
    hooks: function hooks(name) {
      var me = this,
          name = _.capitalize(name),
          beforeHook = "onBefore" + name,
          afterHook = "onAfter" + name,
          beforeEvent = "before" + name,
          afterEvent = "after" + name;
      
      return function decorateWithHooks() {
        var ret;
        
        if (!this.trigger) throw new Error(this.getType() + " doesn't appear to have included Posture.behaviors.EventPublisher which is required in order to use the hooks decorator.");
        
        if ( this[beforeHook] ) this[beforeHook].apply(this, arguments);
        this.trigger.apply(this, [beforeEvent].concat(slice.call(arguments)));
        ret = me.apply(this, arguments);
        if ( this[afterHook] ) this[afterHook].apply(this, arguments);
        this.trigger.apply(this, [afterEvent].concat(slice.call(arguments)));
        return ret;
      }
    }
  });
  
  return Posture;
});
