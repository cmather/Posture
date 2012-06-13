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
    
    defaults: {},
    
    isInserted: false,
    
    isRendered: false,
     
    initialize: function initialize(config) {
      
    },
    
    render: function render(container, method, index) {
      this.createElement()
          .applyId()
          .applyClasses()
          .applyStyles()
          .applyAttributes()
          .bindDomEvents.apply(this, this.domEvents);
      this[method || "append"](container || this.container, index);
      this.isRendered = true;
      return this;
    }.posture("hooks", "render"),
    
    createElement: function createElement() {
      var el, $el, oldEl, attributes, innerHTML, attrName, attrValue;
      
      if (_.isUndefined(this.el)) {
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
      
      return this; 
    }.posture("hooks", "createElement"),
    
    applyId: function applyId() {      
      this.id || (this.id = this.el.id || Posture.Component.uniqueId());
      if (this.el.id !== this.id) {
        this.el.id = this.id;
      }
      return this;
    }.posture("hooks", "applyId"),
    
    applyClasses: function applyClasses() {
      var existingClasses = this.el.className ? this.el.className.split(" ") : [], 
          classes;
          
      this.classNames || (this.classNames = []);
      classes = _.without(this.classNames.concat(existingClasses), "", null, undefined);
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
    
    bindDomEvents: function bindDomEvents() {
      var events = arguments;
      _.forEach(events, function bindEvent(name) {
        this._domEventWrappers || (this._domEventWrappers = {});
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
    }
  };
  
  Posture.Class.create(Component, Posture);
  
  return Posture;
  
});