define(["Posture/behaviors/EventPublisher"], function(Posture) {
  
  var EventPublisher = Posture.behaviors.EventPublisher;
  
  describe("Posture.behaviors.EventPublisher", function() {
    it ("should be defined", function() {
      expect(Posture.behaviors.EventPublisher).toBeDefined();
    });
    
    describe("EventPublisher Instances", function() {
      it ("should initialize an empty and unique _events object on new instances", function() {
        var a = new EventPublisher();
        var b = new EventPublisher();
        
        expect(a._events).toBeDefined();
        expect(b._events).toBeDefined();
        expect(a._events).not.toBe(b._events);
      });
      
      describe("addEvent(event, defaultHandler, context)", function() {
        it ("should allow only an event name to be passed as a parameter", function() {
          var publisher = new EventPublisher();
          publisher.addEvent("event");
          
          expect(publisher._events["event"]).toBeDefined();
          expect(publisher._events["event"].defaultHandler).toBeDefined();
          expect(publisher._events["event"].defaultHandler.callback).toBe(Posture.emptyFn);
          expect(publisher._events["event"].defaultHandler.context).toBe(publisher);
          expect(publisher._events["event"].handlers.length).toBe(0);
        });
        
        it ("should allow you to specify a defaultHandler with another context", function() {
          var context = {
            defaultHandler: function() {}
          };
          
          var publisher = new EventPublisher();
          
          publisher.addEvent("event", context.defaultHandler, context);
          
          expect(publisher._events["event"].defaultHandler.callback).toBe(context.defaultHandler);
          expect(publisher._events["event"].defaultHandler.context).toBe(context);
        });
        
        it ("should default the context of the defaultHandler to the event publisher object if none is specified", function() {
          var publisher = new EventPublisher();
          function defaultHandler() {}
          publisher.addEvent("event", defaultHandler);
          expect(publisher._events["event"].defaultHandler.callback).toBe(defaultHandler);
          expect(publisher._events["event"].defaultHandler.context).toBe(publisher);
        });
        
        it ("should merge a new defaultHandler configuration into an existing event if the event already exists", function() {
          var publisher = new EventPublisher();
          function first() {}
          function second() {}
          var handler = {};
          publisher.addEvent("event", first);
          publisher._events["event"].handlers.push(handler)
          publisher.addEvent("event", second);
          expect(publisher._events["event"].defaultHandler.callback).toBe(second);
          expect(publisher._events["event"].handlers[0]).toBe(handler);
        });
      });
      
      describe("on(events, callback, context)", function() {
        it ("should add a handler for the event defaulting the context to the event publisher object", function() {
          var publisher = new EventPublisher();
          
          function handler() {}
          publisher.on("event", handler);
          
          expect(publisher._events.event).toBeDefined();
          expect(publisher._events.event.handlers.length).toBe(1);
          expect(publisher._events.event.handlers[0].callback).toBe(handler);
          expect(publisher._events.event.handlers[0].context).toBe(publisher);
        });
        
        it ("should add a handler for the event with a defaultHandler and handler context if one is given", function() {
          var publisher = new EventPublisher();
          var context = {};
          function handler() {}
          publisher.on("event", handler, context);
          
          expect(publisher._events.event.handlers[0].context).toBe(context);
          expect(publisher._events.event.defaultHandler.context).toBe(publisher);
        });
        
        it ("should allow adding multiple handlers for an event", function() {
          var publisher = new EventPublisher();
          function handler() {}
          
          publisher.on("event", handler);
          publisher.on("event", handler);
          
          expect(publisher._events.event.handlers.length).toBe(2);
        });
        
        it ("should allow adding multiple events at once", function() {
          var publisher = new EventPublisher();
          function handler() {}
          
          publisher.on("first second", handler);
          
          expect(publisher._events.first).toBeDefined();
          expect(publisher._events.second).toBeDefined();
          
          expect(publisher._events.first.handlers[0].callback).toBe(handler);
          expect(publisher._events.second.handlers[0].callback).toBe(handler);
        });
        
        it ("on('all') should respond to all events", function() {
          var publisher = new EventPublisher();
          
          var harness = {
            handler: function() {}
          };
          
          spyOn(harness, "handler");
          
          publisher.on("one", Posture.emptyFn);
          publisher.on("two", Posture.emptyFn);
          publisher.on("all", harness.handler);
          
          publisher.trigger("one two");
          
          expect(harness.handler.calls.length).toBe(2);
          
        });
      });
      
      describe("off(events, callback, context)", function() {
        it ("should remove the handler for the specified callback and context", function() {
          var publisher = new EventPublisher();
          var context = {};
          function handler() {}
          publisher.on("event", handler, context);
          
          expect(publisher._events.event.handlers.length).toBe(1);
          
          publisher.off("event", handler, context);
          
          expect(publisher._events.event.handlers.length).toBe(0);
                                        
        });
        
        it ("should not remove the handler if the context is different", function() {
          var publisher = new EventPublisher();
          var context = {}, context2 = {};
          function handler() {}
          
          publisher.on("event", handler, context);
                    
          publisher.off("event", handler, context2);
          
          expect(publisher._events.event.handlers.length).toBe(1);
        });
        
        it ("should not do anything if the handler is not found", function() {
          var publisher = new EventPublisher();
          publisher.on("event", Posture.emptyFn);
          publisher.off("event", function() {});
          expect(publisher._events["event"].handlers.length).toBe(1);
        });
        
        it ("should remove multiple handlers if they're the same function and context", function() {
          var publisher = new EventPublisher();
          function handler() {}
          publisher.on("event", handler);
          publisher.on("event", handler);
          expect(publisher._events["event"].handlers.length).toBe(2);
          publisher.off("event", handler);
          expect(publisher._events["event"].handlers.length).toBe(0);
        });
        
        it ("should remove handlers for all events specified in the events string", function() {
          var publisher = new EventPublisher();
          function handler() {}
          publisher.on("one", handler);
          publisher.on("two", handler);
          expect(publisher._events["one"].handlers.length).toBe(1);
          expect(publisher._events["two"].handlers.length).toBe(1);
          
          publisher.off("one two", handler);
          
          expect(publisher._events["one"].handlers.length).toBe(0);
          expect(publisher._events["two"].handlers.length).toBe(0);
        });
      });
      
      describe("trigger(events)", function() {
        it ("should trigger the specified event and proxy the arguments to the event handlers", function() {
          var publisher = new EventPublisher();
          var harness = {
            one: function() {},
            two: function() {}
          };
          
          spyOn(harness, "one");
          spyOn(harness, "two");
          publisher.on("event", harness.one);
          publisher.on("event", harness.two);
          publisher.trigger("event", "arg1", "arg2");
          
          expect(harness.one).toHaveBeenCalled();
          expect(harness.two).toHaveBeenCalled();
          expect(harness.one.calls[0].args[0]).toBe("arg1");
          expect(harness.one.calls[0].args[1]).toBe("arg2");
          
        });
        
        it ("should call the defaultHandler for the event after the handler queue is complete", function() {
          var publisher = new EventPublisher();
          var harness = {
            defaultHandler: function() {},
            one: function() {},
            two: function() {}
          };
          
          spyOn(harness, "defaultHandler");
          spyOn(harness, "one");
          spyOn(harness, "two");
          
          publisher.addEvent("event", harness.defaultHandler);
          publisher.on("event", harness.one);
          publisher.on("event", harness.two);
          
          publisher.trigger("event");
          
          expect(harness.one).toHaveBeenCalled();
          expect(harness.two).toHaveBeenCalled();
          expect(harness.defaultHandler).toHaveBeenCalled();
        });
      });
    });
  });
  
});