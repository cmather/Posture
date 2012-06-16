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

    capitalize: function capitalize(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },

    get: function get(object, key) {
      var tokens, context, name, result;
      if (!(_.isObject(object) && _.isString(key))) throw new Error("_.get expects an object and a string key");
      tokens = key.split(".");
      context = object;
      while (key = tokens.shift()) {
        if (context[key]) {
          result = context[key];
          context = context[key];
        }
        else {
          result = undefined;
          break;
        }
      }
      return result;
    },

    classInheritsFrom: function inheritsFrom(SuperClass, SubClass) {
      return (SuperClass === SubClass) ||
        !!(SubClass && SubClass.prototype && SuperClass && SuperClass.prototype && SuperClass.prototype.isPrototypeOf(SubClass.prototype));
    },

    defaultValue: function defaultValue(source, defaultValue) {
      return (_.isUndefined(source) || _.isNull(source)) ? defaultValue : source;
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
          beforeHook,
          afterHook,
          beforeEvent,
          afterEvent;

      name = _.capitalize(name);
      beforeHook = "onBefore" + name,
      afterHook = "onAfter" + name,
      beforeEvent = "before" + name,
      afterEvent = "after" + name;

      return function decorateWithHooks() {
        var ret, args;

        args = slice.call(arguments).concat([this]);



        if (!this.trigger) throw new Error(this.getType() + " doesn't appear to have included Posture.behaviors.EventPublisher which is required in order to use the hooks decorator.");

        if ( this[beforeHook] ) this[beforeHook].apply(this, args);
        this.trigger.apply(this, [beforeEvent].concat(args));
        ret = me.apply(this, arguments);
        if ( this[afterHook] ) this[afterHook].apply(this, args);
        this.trigger.apply(this, [afterEvent].concat(args));
        return ret;
      };
    }
  });

  return Posture;
});
