define(["Posture/Class"], function(Posture) {
  
  var eventSplitter = /\s+/;
  
  var EventPublisher = {
    
    Name: "behaviors.EventPublisher",
    
    initialize: function initialize() {
      this._events = {};
    },
    
    on: function on(events, callback, context) {
      var handlers, config;
      
      if(!callback) return this;
      
      events = events.split(eventSplitter);
      context = context || this;
      
      while (event = events.shift()) {
        config = this._events[event] || this.addEvent(event, null, this);
        config.handlers.push({callback: callback, context: context});
      }
      
      return this;
    },
    
    addEvent: function addEvent(event, defaultHandler, context) {
      var eventConfig;
      
      eventConfig = this._events[event] || { handlers: [] };
      
      this._events[event] = _.extend(eventConfig, {
        defaultHandler: {
          context: context || this,
          callback: defaultHandler || Posture.emptyFn
        }
      });
            
      return eventConfig;
    },
    
    removeEvent: function removeEvent(event) {
      if ( this._events[event] ) delete this._events[event];
    },
    
    off: function off(events, callback, context) {
      var i, length, handlers, config;
      
      if (!(events || callback || context)) {
        this._events = {};
        return this;
      }
      
      context = context || this;
      events = events ? events.split(eventSplitter) : _.keys(this._events);
      
      while (event = events.shift()) {
        config = this._events[event];
        handlers = config.handlers;
  
        for (i = handlers.length - 1; i >= 0; i--) {
          handler = handlers[i];
          if (handler.callback === callback && (handler.context === context)) {
            handlers.splice(i, 1);
          }
        }
      }
    },
    
    trigger: function trigger(events) {
      var i, length, event, eventArguments, allEventArgs, eventConfig, allHandlers, allDefaultHandler, defaultHandler, handlers;
      
      events = events.split(eventSplitter);
      eventArguments = _.toArray(arguments).slice(1);
      
      while (event = events.shift()) {
        eventConfig = this._events[event];
        
        if (all = this._events.all) {
          allHandlers = all.handlers.slice();
          allDefaultHandler = all.defaultHandler;
          allEventArgs = [event].concat(eventArguments);
        }
        
        if (eventConfig) {
          handlers = eventConfig.handlers.slice();
          defaultHandler = eventConfig.defaultHandler;
          
          for (i = 0, length = handlers.length; i < length; i++) {
            handlers[i].callback.apply(handlers[i].context, eventArguments);
          }
          
          defaultHandler.callback.apply(defaultHandler.context, eventArguments);
        }

        if (all) {
          for (i = 0, length = allHandlers.length; i < length; i++) {
            allHandlers[i].callback.apply(allHandlers[i].context, allEventArgs);
          }
          allDefaultHandler.callback.apply(allDefaultHandler.context, allEventArgs);
        }
      }
      
      return this;    
    }
  };
  
  Posture.Class.create(EventPublisher, Posture);
  
  return Posture;
  
});