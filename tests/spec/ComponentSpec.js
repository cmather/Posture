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

      describe("Utility Methods", function() {
        describe("delegateFor(key)", function() {
          var component, delegates;

          beforeEach(function() {
            component = new Posture.Component();
          });

          describe("delegate doesn't exist", function() {
            it("should return the component", function() {
              var result = component.delegateFor("children");
              expect(result).toBe(component);
            });
          });
          describe("delegate is a function", function() {
            it("should return the result of the function", function() {
              component.delegates = {
                children: function() {
                  return "result";
                }
              };
              var result = component.delegateFor("children");
              expect(result).toBe("result");
            });
          });
          describe("delegate is anything else", function() {
            it("should return the specified object", function() {
              var child = new Posture.Component();
              component.delegates = {
                children: child
              };
              var result = component.delegateFor("children");
              expect(result).toBe(child);
            });
          });
        });


      });

      describe("Children Methods", function() {
        var component, config, e;

        beforeEach(function() {
          component = new Posture.Component();
          component.children = [];
          config = {
              id: "child"
            };

            e = {};
        });

        describe("childFactoryFrom(factory)", function() {
          describe("factory is a string", function() {
            it ("should return the property value (provided its a Posture.Component) on the component whose name is the factory parameter", function() {
              component.childFactory = Posture.Component;
              expect(component.childFactoryFrom("childFactory")).toBe(component.childFactory);
            });
          });

          describe("factory is a function that is of type Posture.Component", function() {
            it ("should return the component", function() {
              var fn = Posture.Component;
              expect(component.childFactoryFrom(fn)).toBe(fn);

              var fn2 = Posture.Component.extend();
              expect(component.childFactoryFrom(fn2)).toBe(fn2);
            });
          });

          describe("factory is something else", function() {
            it ("should throw an exception", function() {
              expect(function() { component.childFactoryFrom(null); }).toThrow();
            });
          });
        });

        describe("childComponentFrom(child, parent)", function() {
          describe("child is an instance of Posture.Component", function() {
            it("should configure the instance by extending the existing config with the childDefaults and a container", function() {
              component.childDefaults = {
                autoRender: false
              };
              component.createElement();

              var child = new Posture.Component();
              spyOn(child, "configure");
              var result = component.childComponentFrom(child);
              expect(result).toBe(child);
              expect(child.configure).toHaveBeenCalled();
              var config = child.configure.calls[0].args[0];
              expect(config.autoRender).toBe(false);
              expect(config.container).toBe(component.el);
            });
          });

          describe("child is config object", function() {
            it("should create a new instance by calling childFactoryFrom and using the config.factory and passing the config merged with childDefaults into the constructor", function() {
              component.createElement();
              component.childDefaults = {
                factory: Posture.Component,
                autoRender: false
              };

              var config = { id: 5 };

              var result = component.childComponentFrom(config);

              expect(result instanceof Posture.Component).toBe(true);
              expect(result.config.factory).toBeUndefined();
              expect(result.config.autoRender).toBe(false);
              expect(result.config.container).toBe(component.el);
              expect(result.config.id).toBe(5);
            });
          });

          describe("parent is a child component", function() {
            it("should set the container to the specified parent", function() {
              component.createElement();
              component.childDefaults = {
                factory: Posture.Component,
                autoRender: false
              };

              var parent = new Posture.Component();
              parent.createElement();

              var config = { id: 5 };

              var result = component.childComponentFrom(config, parent);

              expect(result.config.factory).toBeUndefined();
              expect(result.config.container).toBe(parent.el);
            });
          });
        });

        describe("addChildComponent(child, options)", function() {


          describe("options.useDelegate === false", function() {
            it ("should bind the child's 'all' event to the onChildEvent handler and add the child to the children queue", function() {
              spyOn(component, "onChildEvent");
              component.addChildComponent(config);
              expect(component.children.length).toBe(1);
              var child = component.children[0];
              child.trigger("click", e);
              expect(component.onChildEvent).toHaveBeenCalledWith(child, "click", e);
            });
          });

          describe("options.useDelegate === true", function() {
            it ("should bind the child's 'all' event to the onChildEvent handler of the delegate and add the child to the delegate's children queue", function() {
              var delegateComponent = new Posture.Component();
              spyOn(delegateComponent, "onChildEvent");
              component.delegates = {children: delegateComponent};
              component.addChildComponent(config, {useDelegate: true});
              expect(delegateComponent.children.length).toBe(1);
              expect(component.children.length).toBe(0);
              var child = delegateComponent.children[0];
              child.trigger("click", e);
              expect(delegateComponent.onChildEvent).toHaveBeenCalledWith(child, "click", e);
            });
          });

          describe("options.index is set to a number", function() {
            it ("should insert the child at the right index", function() {
              var one = {id: "one"}, two = {id: "two"}, three = {id: "three"};

              component.addChildComponent(one);
              component.addChildComponent(three);
              component.addChildComponent(two, {index: 1});
              expect(component.children[1].config.id).toBe("two");
            });
          });

          describe("options.render is true", function() {
            it ("should automatically render the child at the right index if one is specified", function() {
              var one = {id: "one"}, two = {id: "two"}, three = {id: "three"};
              component.addChildComponent(one);
              component.addChildComponent(three);
              component.render();

              component.addChildComponent(two, {index: 1, render: true});
              var child = component.children[1];
              expect(child.config.id).toBe("two");
              expect(child.isRendered).toBe(true);
            });
          });
        });

        describe("processChild(child, key, options)", function() {
          it ("should call addChildComponent and if a key is provided, add the instance as a component property", function() {
            var options = { useDelegate: true };
            spyOn(component, "addChildComponent").andCallThrough();
            var result = component.processChild(config, "myChild", options);
            expect(result instanceof Posture.Component).toBe(true);
            expect(component.addChildComponent).toHaveBeenCalledWith(config, options);
            expect(component.myChild).toBe(result);
          });
        });

        describe("processComponentChildren()", function() {
          it ("should process each component child in the componentChildren object and set isComponentChildrenProcessed = true", function() {
            var children = {
              myChild: {
                factory: Posture.Component,
                id: "myChild"
              }
            };

            component.componentChildren = children;
            spyOn(component, "processChild").andCallThrough();
            component.processComponentChildren();
            expect(component.children.length).toBe(1);
            expect(component.processChild).toHaveBeenCalled();
            var args = component.processChild.calls[0].args;

            expect(args[2].useDelegate).toBe(false);
            expect(args[1]).toBe("myChild");
            expect(args[0]).toBe(children.myChild);

            expect(component.isComponentChildrenProcessed).toBe(true);
          });
        });

        describe("processConfigChildren()", function() {
          it ("should process each config child in the configChildren array and set isConfigChildrenProcessed = true", function() {
            var children = [{
                factory: Posture.Component,
                id: "myChild"
              }];

            component.configChildren = children;

            spyOn(component, "processChild").andCallThrough();
            component.processConfigChildren();
            expect(component.children.length).toBe(1);
            expect(component.processChild).toHaveBeenCalled();
            var args = component.processChild.calls[0].args;


            expect(args[2].useDelegate).toBe(true);
            expect(args[1]).toBeNull();
            expect(args[0]).toBe(children[0]);

            expect(component.isConfigChildrenProcessed).toBe(true);

          });
        });

        describe("appendChild(element)", function() {
          it ("should append the element to the component's or the children delegate's el", function() {
            var element = document.createElement("div");
            component.createElement();
            component.appendChild(element);
            expect(component.$("div").length).toBe(1);
          });
        });
      });

      describe("Rendering Methods", function() {
        var component, existing, id = "existing", classes = "class1 class2", innerHTML;

        beforeEach(function() {
          component = new Posture.Component();
          existing = document.createElement("div");
          innerHTML = "<span></span>";
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

          describe("el property is set to an element", function() {
            it ("should set the element to the existing element in the dom", function() {
              component.el = existing;
              component.createElement();
              expect(component.el.id).toEqual(existing.id);
            });
          });

          describe("innerHTML", function() {
            describe("template function exists", function() {
              it("should call the template function with a default context of the component itself", function() {
                component.template = function(context) {
                  return "template";
                };
                spyOn(component, "template").andCallThrough();
                spyOn(component, "applyTemplate").andCallThrough();
                spyOn(component, "getTemplateContext").andCallThrough();
                component.createElement();
                expect(component.template).toHaveBeenCalledWith(component);
                expect(component.el.innerHTML).toBe("template");
                expect(component.applyTemplate).toHaveBeenCalled();
                expect(component.getTemplateContext).toHaveBeenCalled();
              });
            });

            describe("no template function but initialHtml is a non empty string", function() {
              it("should set the component's innerHTML to the value of initialHtml", function() {
                component.initialHtml = "initial";
                component.createElement();
                expect(component.el.innerHTML).toBe("initial");
              });
            });

            describe("no template function and no initialHtml", function() {
              it("should leave the current element's html in place", function() {
                component.el = $(existing);
                component.createElement();
                expect(component.el.innerHTML).toBe(innerHTML);
              });
            });

            describe("existing html", function() {
              it ("should be saved to the savedInnerHTML property on the component", function() {
                component.el = existing;
                component.initialHtml = "initial";
                component.createElement();
                expect(component.el.innerHTML).toBe("initial");
                expect(component.savedInnerHTML).toBe(innerHTML);
              });
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

        describe("renderChild(child, method, index)", function() {
          it("should call the render method of the child passing the current component's element as the container parameter", function() {
            var child = {
              render: function render(container, method, index) {}
            };
            spyOn(child, "render");

            component.createElement();
            component.renderChild(child, "append");

            expect(child.render).toHaveBeenCalledWith(component.el, "append", undefined);

          });
        });

        describe("renderChildren()", function() {
          it("should call the render method of each child passing the component's element as the container parameter", function() {
            var one = {
              render: function render(container, method, index) {}
            };
            var two = {
              render: function render(container, method, index) {}
            };
            spyOn(one, "render");
            spyOn(two, "render");

            component.children = [one, two];
            component.createElement();
            component.renderChildren();

            expect(one.render).toHaveBeenCalledWith(component.el, "append", undefined);
            expect(two.render).toHaveBeenCalledWith(component.el, "append", undefined);

          });
        });

        describe("render(container, method, index)", function() {
          beforeEach(function() {
            spyOn(component, "createElement").andCallThrough();
            spyOn(component, "applyId").andCallThrough();
            spyOn(component, "applyClasses").andCallThrough();
            spyOn(component, "applyStyle").andCallThrough();
            spyOn(component, "applyAttributes").andCallThrough();
            spyOn(component, "bindDomEvents").andCallThrough();
            spyOn(component, "renderChildren").andCallThrough();
            spyOn(component, "append").andCallThrough();
            spyOn(component, "insert").andCallThrough();
          });

          describe("render()", function() {
            it("should execute the rendering pipeline, append the component element to document.body and return the component", function() {

              var ret = component.render();

              expect(ret).toBe(component);
              expect(component.createElement).toHaveBeenCalled();
              expect(component.applyId).toHaveBeenCalled();
              expect(component.applyClasses).toHaveBeenCalled();
              expect(component.applyStyle).toHaveBeenCalled();
              expect(component.applyAttributes).toHaveBeenCalled();
              expect(component.bindDomEvents).toHaveBeenCalled();
              expect(component.renderChildren).toHaveBeenCalled();
              expect(component.append).toHaveBeenCalledWith(undefined, undefined);
            });
          });

          describe("render(container)", function() {
            it("should execute the rendering pipeline, call append with the container, and return the component", function() {
              var ret = component.render(existing);
              expect(component.append).toHaveBeenCalledWith(existing, undefined);
            });
          });

          describe("render(container, 'insert')", function() {
            it("should execute the rendering pipeline, call insert with the container and return the component", function() {
              var ret = component.render(existing, "insert");
              expect(component.insert).toHaveBeenCalledWith(existing, undefined);
            });
          });

          describe("render(container, method, index)", function() {
            it("should execute the rendering pipeline, call insert with the container and index, and return the component", function() {
              var ret = component.render(existing, "insert", 5);
              expect(component.insert).toHaveBeenCalledWith(existing, 5);
            });
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
          component.onBeforeClick = function() {
            notes.push("onBeforeClick");
          };
          component.onAfterClick = function() { notes.push("onAfterClick"); };
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
            var e = {};
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