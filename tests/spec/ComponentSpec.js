define(["Posture/Component"], function(Posture) {
  var Component = Posture.Component;
  describe("Posture.Component", function() {

    describe("Class Methods", function() {
      describe("constructor(config)", function() {

      });

      describe("uniqueId()", function() {
        it ("should return an incremented id each time it is called", function() {
          expect(Posture.Component.uniqueId()).toBe("component-0");
          expect(Posture.Component.uniqueId()).toBe("component-1");
        });
      });
    });

    describe("Instance Methods", function() {

      describe("Rendering Methods", function() {
        var component, existing, id = "existing", classes = "class1 class2", innerHTML;

        beforeEach(function() {
          component = new Posture.Component();
          existing = document.createElement("div");
          innerHTML = "<span></span>"
          existing.innerHTML = innerHTML;
          existing.setAttribute("id", id);
          existing.setAttribute("class", classes);
          document.body.appendChild(existing);
        });

        afterEach(function() {
          try {
            $("#existing").remove();
            $(component.el).remove();
          } 
          catch(e) {

          }
        });

        describe("createElement()", function() {

          describe("no el property on the component", function() {
            it ("should create a new element and set the el and $el properties of the component", function() {
              component.tagName = "table";
              component.createElement();
              expect(_.isElement(component.el)).toBe(true);
              expect(component.$el.length).toBeDefined();
            });
          });

          describe("el property is set to a jQuery selector string and the dom element is found", function() {

            it ("should set the element to the existing element in the dom", function() {
              component.el = "#existing";
              component.createElement();
              expect(component.el.id).toEqual(existing.id);
              expect(component.el.className).toEqual(existing.className);
              expect(component.el.innerHTML).toEqual(existing.innerHTML);
              expect(component.el.style).toEqual(existing.style);
            });

          });

          describe("el property is set to a jQuery selector string and the dom element is not found", function() {
            it ("should throw an exception to indicate the element couldn't be found", function() {
              component.el = "#notexist";
              expect(component.createElement).toThrow();
            });
          });

          describe("el property is set to a jQuery selector for a dom element that has a different tagName", function() {
            it ("should create a new element with the right tagName, and replace the existing element with the new element with all attributes and innerHTML copied to the new element", function() {

              component.tagName = "table";
              component.el = "#existing";
              component.createElement();

              expect($("#existing").length).toBe(1);

              expect(component.el.attributes.length).toBe(2);
              expect(component.el.attributes[0].name).toBe("id");
              expect(component.el.attributes[0].value).toBe("existing");
              expect(component.el.attributes[1].name).toBe("class");
              expect(component.el.attributes[1].value).toBe("class1 class2");
              expect(component.el.innerHTML).toBe(innerHTML);

            });
          });

          describe("el property is set to a jQuery object", function() {
            it ("should set the element to the existing element in the dom", function() {
              component.el = $("#existing");
              component.createElement();
              expect(component.el.id).toEqual(existing.id);
            });
          });
        });

        describe("applyId()", function() {

          beforeEach(function() {
            component.el = existing;
            component.$el = $(existing);
          });

          describe("element has id and component does not", function() {
            it ("should set the component's id to the element's id", function() {
              component.applyId();
              expect(existing.id).toBe(id);
              expect(component.id).toBe(existing.id);
            });
          });

          describe("component has id and element does not", function() {
            it ("should set the element's id to the component id", function() {
              component.id = "cid";
              component.applyId();
              expect(component.id).toBe("cid");
              expect(existing.id).toBe(component.id);
            });
          });

          describe("element has id and component has id", function() {
            it ("should set the element's id to the component id", function() {
              component.id = "cid";
              expect(existing.id).toBe(id);
              component.applyId();
              expect(component.id).toBe("cid");
              expect(existing.id).toBe(component.id);
            });
          });

          describe("no id exists on the element or the component", function() {
            it ("should generate a new random id and assign it to the component's id and the element's id", function() {
              existing.id = "";
              component.applyId();
              expect(component.id).toBeTruthy();
              expect(existing.id).not.toBe(id);
              expect(component.id).toBe(existing.id);
            });
          });
        });

        describe("applyClasses()", function() {
          var classNames;

          beforeEach(function() {
            classNames = ["component", "component-child"];
            component.classNames = classNames;
          });

          describe("no classes exist on the element", function() {
            it ("should add the component's classes to the element", function() {
              component.createElement();
              component.applyClasses();
              expect(component.el.className).toBe("component component-child");
            });
          });

          describe("classes already exist on the element", function() {
            it ("should add the component's classes before the existing element classes", function() {
              component.el = existing;
              component.applyClasses();
              expect(component.el.className).toBe("component component-child class1 class2");
            });
          });
        });

        describe("applyStyle()", function() {
          it ("should extend the element's styles with the component's styles", function() {
            var style = {
              color: "blue",
              "padding-top": "5px"
            };

            component.el = existing;
            component.style = style;
            component.applyStyle();

            expect(component.el.style).toBeDefined();
            expect(component.el.style.color).toBe(style.color);
            expect(component.el.style["padding-top"]).toBe(style["padding-top"]);

          });
        });

        describe("applyAttributes()", function() {
          it ("should add all of the component's attributes to the element's attributes", function() {
            var attributes = {
              editable: true,
              "data-test": "testing"
            };

            component.el = existing;
            component.attributes = attributes;
            component.applyAttributes();

            expect(component.el.getAttribute("editable")).toBe("true");
            expect(component.el.getAttribute("data-test")).toBe("testing");

          });
        });

        describe("html(value)", function() {
          describe("value is passed as a parameter", function() {
            it("should set the innerHTML of the component's element to the value", function() {
              component.el = existing;
              component.html("some html");
              expect(component.el.innerHTML).toBe("some html");
            });
          });

          describe("no value is passed", function() {
            it("should return the innerHTML of the component's element", function() {
              component.el = existing;
              expect(component.html()).toBe(innerHTML);
            });
          });
        });

        describe("append(container)", function() {
          describe("container given", function() {
            it ("should set the component's container property to the given container and append the component's element to the container", function() {
              var container = existing, $el;
              component.id = "cmp";
              component.createElement();
              component.applyId();
              component.append(container);
              $el = $("#cmp");
              expect ($el.length).toBe(1);
              expect($el[0].parentNode).toBe(existing);
              expect(component.container).toBe(existing);
            });
          });

          describe("no container given", function() {
            it ("should append the component's element to the document.body and set the component's container property", function() {
              var $el;
              component.id = "cmp";
              component.createElement();
              component.applyId();
              component.append();
              $el = $("#cmp");
              expect(component.container).toBe(document.body);
              expect(component.el.parentNode).toBe(document.body);
              expect(component.isInserted).toBe(true);
            });
          });
        });

        describe("insert(container, index)", function() {
          describe("no container or index given", function() {
            it("should append the element as the last element in the document.body", function() {
              var count, $el;
              component.id = "cmp";
              component.createElement();
              component.applyId();
              component.insert();            
              $el = $("#cmp");

              expect($el.length).toBe(1);
              expect( _.toArray(document.body.childNodes).indexOf(component.el) ).toBe(document.body.childNodes.length - 1);
              expect(component.isInserted).toBe(true);          
            });
          });

          describe("container given but no index", function() {
            it ("should append the element as the last element in the container", function() {
              var count, $el;
              component.id = "cmp";
              component.createElement();
              component.applyId();
              component.insert(existing);            
              $el = $("#cmp");

              expect($el.length).toBe(1);
              expect( _.toArray(existing.childNodes).indexOf(component.el) ).toBe(existing.childNodes.length - 1);
              expect(component.isInserted).toBe(true);
            });
          });

          describe("container and index given", function() {
            it ("should insert the element at the given index", function() {
              var count, $el;
              component.id = "cmp";
              component.createElement();
              component.applyId();
              component.insert(existing, 0);      
              $el = $("#cmp");
              expect($el.length).toBe(1);
              expect( _.toArray(existing.childNodes).indexOf(component.el) ).toBe(0);
              expect(component.isInserted).toBe(true);
            });
          });
        });

        describe("remove()", function() {
          it("should remove the component's element from the dom and set isInserted to false", function() {
            component.id = "cmp";
            component.createElement();
            component.applyId();
            component.append();

            expect(component.isInserted).toBe(true);
            expect($("#cmp").length).toBe(1);
            component.remove();
            expect(component.isInserted).toBe(false);
            expect($("#cmp").length).toBe(0);

          });
        });
      });

      describe("Dom Event Methods", function() {
        var domEvents = ["click"],
        component,
        handlers,
        notes;

        beforeEach(function() {
          notes = [];
          component = new Posture.Component();
          component.domEvents = domEvents;
          component.createElement();
          component._notes = [];
          component.onBeforeClick = function() {
            notes.push("onBeforeClick")
          };
          component.onAfterClick = function() { notes.push("onAfterClick")};
          handlers = {
            onClick: function() {
              notes.push("onClick");
            }
          };
          spyOn(handlers, "onClick").andCallThrough();
          spyOn(component, "onBeforeClick").andCallThrough();
          spyOn(component, "onAfterClick").andCallThrough();
          component.append();
        });

        afterEach(function() {
          try {
            $(component.el).remove();
            component = null;
          } 
          catch(e) {

          }
        });

        describe("bindDomEvents()", function() {
          it ("should create an event handler on the dom element and add a domEventWrapper handler to the component's _domEventWrappers cache", function() {
            component.bindDomEvents("click");
            expect(typeof component._domEventWrappers["click"]).toBe("function");
            expect(component.$el.data("events")["click"].length).toBe(1);
          });

          it ("should bind the element's event to the component's onDomEvent handler", function() {
            var e = {}
            component.onDomEvent = function() {};

            spyOn(component, "onDomEvent");

            component.bindDomEvents("click");

            component.$el.trigger("click");

            expect(component.onDomEvent).toHaveBeenCalled();
            expect(component.onDomEvent.calls[0].args[0]).toBe("click");
            expect(typeof component.onDomEvent.calls[0].args[1]).toBe("object");
          });


        });

        describe("onDomEvent(name, e)", function() {
          it ("should call the eventDomWrapper method cached in the _domEventWrappers object for the event which should first call the before hook, then trigger the component event, then call the after hook", function() {
            var e = {};
            component.bindDomEvents("click");
            component.on("click", handlers.onClick);
            component.onDomEvent("click", e);
            expect(notes.toString()).toBe("onBeforeClick,onClick,onAfterClick");
            expect(component.onBeforeClick).toHaveBeenCalledWith(e, component);
            expect(component.onAfterClick).toHaveBeenCalledWith(e, component);
            expect(handlers.onClick).toHaveBeenCalledWith(e, component);
          });
        });
      });
    });

  });

  return Posture;

});