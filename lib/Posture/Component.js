define(["Posture/Class", "Posture/behaviors/EventPublisher"], function(Posture) {

  var _ = Posture._,
      $ = Posture.$;

  var Component = {

    Name: "Component",

    Includes: [Posture.behaviors.EventPublisher],

    ClassProperties: {
      count: 0,
      uniqueId: function uniqueId() {
        return "component-" + Posture.Component.count++;
      }
    },

    tagName: "div",

    classNames: ["component"],

    style: {},

    domEvents: [],

    defaults: {
      autoRender: true,
      html: "",
      attributes: {},
      classNames: [],
      style: {},
      children: []
    },

    childDefaults: {
      autoRender: true
    },

    children: {},

    delegates: {},

    isInserted: false,

    isRendered: false,

    isConfigChildrenProcessed: false,

    isComponentChildrenProcessed: false,

    template: null,

    initialHtml: null,

    savedInnerHTML: null,

    initialize: function initialize(config) {
      this.configure(config);

      if (this.autoRender) this.render();


    }.posture("hooks", "initialize"),

    configure: function configure(config) {
      var defaults = this.defaults = this.mergePrototypePropertyValues(null, "defaults");

      config = this.config = config || {};

      this.componentChildren = this.mergePrototypePropertyValues(null, "children");
      this.configChildren = _.defaultValue(config.children, defaults.children);
      this.children = [];

      this.autoRender = _.defaultValue(config.autoRender, defaults.autoRender);
      this.initialHtml = _.defaultValue(config.html, defaults.html);
      this.attributes = this.mergePrototypePropertyValues(config.attributes || defaults.attributes, "attributes");
      this.style = this.mergePrototypePropertyValues(config.style || defaults.style, "style");
      this.classNames = this.collectPrototypePropertyValues("classNames", "down").concat(config.classNames || defaults.classNames || []);
      this.el = _.defaultValue(config.el || defaults.el, null);
      this.container = _.defaultValue(config.container || defaults.container, null);
      this.insertIndex = _.defaultValue(config.index, null);

      if (config.Includes) {
        _.forEach(config.Includes, function doInclude(include) {
          this.include(include);
        }, this);
      }

      this.processChildren();

      return this;

    }.posture("hooks", "configure"),

    delegateFor: function delegateFor(key) {
      var result = _.get(this.delegates, key);

      if (_.isFunction(result)) {
        result = result.call(this);
      }
      else if (_.isString(result)) {
        result = this[result];
      }
      else if (_.isUndefined(result)) {
        result = this;
      }

      return result;
    },

    $: function $(selector) {
      return this.$el.find(selector);
    },

    render: function render(container, index) {
      this.createElement()
          .applyId()
          .applyClasses()
          .applyStyle()
          .applyAttributes()
          .bindDomEvents.apply(this, this.domEvents);
      this.renderChildren();
      this[_.isUndefined(index) ? "append" : "insert"](container || this.container, index || this.insertIndex || undefined);
      this.isRendered = true;
      return this;
    }.posture("hooks", "render"),


    createElement: function createElement() {
      var el, $el, oldEl, attributes, innerHTML, attrName, attrValue;

      if (_.isEmpty(this.el)) {
        el = document.createElement(this.tagName);
        $el = $(el);
      }
      else if (_.isString(this.el)) {
        $el = $(this.el);
        el = $el[0];
      }
      else if (this.el.length && this.el.length > 0) {
        $el = this.el;
        el = $el[0];
      }
      else if (_.isElement(this.el)) {
        el = this.el;
        $el = $(el);
      }

      if (_.isUndefined(el)) throw new Error(this.type() + ": Unable to find or create a dom element. Did you specify a tagName or a dom selector to an element on the page? The component's el property is set to '" + this.el + "'");

      if (el.tagName.toLowerCase() !== this.tagName.toLowerCase()) {
        oldEl = el;
        attributes = el.attributes;
        innerHTML = el.innerHTML;

        el = document.createElement(this.tagName);
        el.innerHTML = innerHTML;
        oldEl.parentNode.replaceChild(el, oldEl);
        $el = $(el);

        _.forEach(attributes, function cloneAttribute(attribute) {
          el.setAttribute(attribute.name, attribute.value);
        });
      }

      this.el = el;
      this.$el = $el;
      this.savedInnerHTML = this.el.innerHTML;

      if (_.isFunction(this.template)) {
        this.html( this.applyTemplate() );
      }
      else if (this.initialHtml) {
        this.html(this.initialHtml);
      }

      return this;
    }.posture("hooks", "createElement"),

    applyTemplate: function applyTemplate() {
      return this.template( this.getTemplateContext() );
    }.posture("hooks", "applyTemplate"),

    getTemplateContext: function getTemplateContext() {
      return this;
    }.posture("hooks", "getTemplateContext"),

    applyId: function applyId() {
      this.id = this.id || this.el.id || Posture.Component.uniqueId();
      if (this.el.id !== this.id) {
        this.el.id = this.id;
      }
      return this;
    }.posture("hooks", "applyId"),

    applyClasses: function applyClasses() {
      var existingClasses = this.el.className ? this.el.className.split(" ") : [],
          classes;

      this.classNames = this.classNames || [];
      classes = _.compact(this.classNames.concat(existingClasses));
      if (classes.length > 0) this.el.className = classes.join(" ");
      return this;
    }.posture("hooks", "applyClasses"),

    applyStyle: function applyStyle() {
      _.extend(this.el.style, this.style);
      return this;
    }.posture("hooks", "applyStyle"),

    applyAttributes: function applyAttributes() {
      _.forOwn(this.attributes, function applyAttribute(value, key, object) {
        this.el.setAttribute(key, value);
      }, this);
      return this;
    }.posture("hooks", "applyAttributes"),

    html: function html(value) {
      if (_.isUndefined(value)) {
        return this.el.innerHTML;
      }
      else {
        this.el.innerHTML = value;
        return this;
      }
    }.posture("hooks", "html"),

    append: function append(container) {
      container = this.container = container || document.body;
      container.appendChild(this.el);
      this.isInserted = true;
      return this;
    }.posture("hooks", "append"),

    insert: function insert(container, index) {
      var sibling;
      container = this.container = container || document.body;
      sibling = container.childNodes && container.childNodes[index];
      this.container.insertBefore(this.el, sibling);
      this.isInserted = true;
      return this;
    }.posture("hooks", "insert"),

    remove: function remove() {
      this.el.parentNode.removeChild(this.el);
      this.isInserted = false;
      return this;
    }.posture("hooks", "remove"),

    renderChildren: function renderChildren() {
      _.forEach(this.children, function(child) {
        this.renderChild(child);
      }, this);
    }.posture("hooks", "renderChildren"),

    renderChild: function renderChild(child, index) {
      child.render(this.el, index);
      return this;
    }.posture("hooks", "renderChild"),

    processChildren: function processChildren() {
      this.processComponentChildren();
      this.processConfigChildren();
    }.posture("hooks", "processChildren"),

    processConfigChildren: function processConfigChildren() {
      if (this.configChildren) {
        _.forEach(this.configChildren, function processConfigChild(child, index) {
          this.processChild(child, null, { useDelegate: true });
        }, this);
      }
      this.isConfigChildrenProcessed = true;
      return this;
    }.posture("hooks", "processConfigChildren"),

    processComponentChildren: function processComponentChildren() {
      if (this.componentChildren) {
        _.forOwn(this.componentChildren, function processComponentChild(child, key) {
          this.processChild(child, key, { useDelegate: false });
        }, this);
      }
      this.isComponentChildrenProcessed = true;
      return this;
    }.posture("hooks", "processComponentChildren"),

    processChild: function processChild(child, key, options) {
      child = _.extend(child, {autoRender: false});
      var instance = this.addChild(child, options);
      if (key) this[key] = instance;
      return instance;
    }.posture("hooks", "processChild"),

    addChild: function addChild(child, options) {
      var childrenDelegate = this, index, useDelegate;

      useDelegate = _.defaultValue(options && options.useDelegate, true);

      if (useDelegate) childrenDelegate = this.delegateFor("children");

      if (options && options.index) child.index = options.index;

      child = this.childComponentFrom(child, childrenDelegate);
      child.on("all", _.bind(childrenDelegate.onChildEvent, childrenDelegate, child), childrenDelegate);

      childrenDelegate.addChildToRenderQueue(child, options && options.index);

      return child;

    }.posture("hooks", "addChild"),

    addChildToRenderQueue: function addChildToRenderQueue(child, index) {
      if (!_.isUndefined(index) && index >= 0) {
        this.children.splice(index, 0, child);
      }
      else {
        this.children.push(child);
      }
    }.posture("hooks", "addChildToRenderQueue"),

    childComponentFrom: function childComponentFrom(child, parent) {
      var instance, config, factory;

      parent = parent || this;

      config = _.extend({}, parent.childDefaults, {container: parent.el});

      if (child instanceof Posture.Component) {
        instance = child;
        instance.configure(_.extend(child.config || {}, config));
      }
      else if (_.isObject(child)) {
        _.extend(config, child);
        factory = parent.childFactoryFrom(config.factory);
        instance = new factory(_.exclude(config, "factory"));
      }
      else {
        throw new Error(this.type() + ": You can only call childComponentFrom with a child parameter that is of type Component, function or object");
      }

      return instance;
    },

    childFactoryFrom: function childFactoryFrom(factory) {
      var type = typeof factory, result;

      switch(type) {
        case "string":
          result = this[factory];
          break;

        case "function":
          result = factory;
          break;

        case "undefined":
          result = Posture.Component;
          break;

        default:
          throw new Error(this.type() + ": componentFactoryFrom can only be called with a factory of type string, function or undefined. You called it with a factory of " + factory);
      }

      if (!_.classInheritsFrom(Posture.Component, result)) {
        throw new Error(this.type() + ": A child factory must inherit from Posture.Component and the provided factory does not");
      }

      return result;
    },

    appendChild: function appendChild(element) {
      this.delegateFor("children").el.appendChild(element);
      return this;
    }.posture("hooks", "appendChild"),

    bindDomEvents: function bindDomEvents() {
      var events = arguments;
      _.forEach(events, function bindEvent(name) {
        this._domEventWrappers = this._domEventWrappers || {};

        this._domEventWrappers[name] = function triggerDomEvent(e, context) {

          this.trigger(name, e, context);

        }.posture("hooks", name);

        this.$el.on(name, _.bind(this.onDomEvent, this, name));

      }, this);
      return this;
    }.posture("hooks", "bindDomEvents"),

    onDomEvent: function onDomEvent(name, e) {
      var domEventWrapper = this._domEventWrappers && this._domEventWrappers[name];
      if (!domEventWrapper) throw new Error(this.type() + ": Couldn't find a dom event wrapper for the event '" + name + ".' Are you sure you called bindDomEvent for this event?");
      domEventWrapper.call(this, e, this);
    },

    onChildEvent: function onChildEvent(component, name) {
      var hook = "on" + _.capitalize(name),
          args = _.toArray(arguments).slice(2);
      if (this[hook]) this[hook].apply(this, args.concat([component]));
      if (this.bubbleChildEvents) this.trigger(name, args.concat([component]));
    }
  };

  Posture.Class.create(Component, Posture);

  return Posture;

});