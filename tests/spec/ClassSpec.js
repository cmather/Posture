define(["Posture/Class"], function(Posture) {
  describe("Posture.Class", function() {
    it ("should be defined", function() {
      expect(Posture.Class).toBeDefined();
    });

    describe("Class.type()", function() {
      it ("should return 'Type'", function() {
        expect(Posture.Class.type()).toBe("Type");
      });
    });

    describe("Class._meta", function() {
      it ("should be an empty object", function() {
        expect(typeof Posture.Class._meta).toBe("object");
      });
    });

    describe("Class.create", function() {
      it ("should return a new Class", function() {
        var C = Posture.Class.create({});
        expect(typeof C).toBe("function");
      });
    });

    describe("new Class({...})", function() {
      it ("should return a new Class", function() {
        var C = new Posture.Class({});
        expect(typeof C).toBe("function");
      });
    });

    describe("new Class({...}) Behavior", function() {
      describe("Class Methods", function() {
        describe("type()", function() {
          it("should return 'Class'", function() {
            var C = new Posture.Class({});
            expect(C.type()).toBe("Class");
          });
        });

        describe("create()", function() {
          it("should return a new instance of the Class", function() {
            var Class = new Posture.Class({});
            var instance = Class.create();
            expect(typeof instance).toBe("object");
          });
        });

        describe("extend()", function() {
          it ("should create a new Class that inherits from this one", function() {

            var Super = new Posture.Class({
              superMethod: function() {}
            });

            var Child = Super.extend({});

            var instance = new Child();

            expect(Super.prototype.isPrototypeOf(instance)).toBe(true);
          });
        });

        describe("_meta", function() {
          it ("should be defined on the Class instance", function() {
            var Class = new Posture.Class();
            expect(typeof Class._meta).toBe("object");
          });
        })
      });

      describe("Class Definition Special Properties", function() {
        describe("Name: Typing and namespacing", function() {
          var Class, context, instance;
          beforeEach(function() {
            context = {};
            Class = new Posture.Class({
              Name: "Bogus.Component"
            }, context);
            instance = new Class();
          });

          it("should create a namespace on the given context", function() {
            expect(typeof context.Bogus.Component).toBe("function");
          });

          it("should create a namespace on window if no context is given", function() {
            Class = new Posture.Class({
              Name: "Bogus.Component"
            });

            expect(typeof window.Bogus.Component).toBe("function");
          });

          it("should create a type property on the _meta property of object instances", function() {
            expect(instance._meta.type).toBe("Component");
          });

          it("should create a namespace property on the _meta property of object instances", function() {
            expect(instance._meta.namespace).toBe("Bogus.Component");
          });
        });

        describe("Extends: Inherit from other classes or constructor functions", function() {
          var Super, Child, context, instance;
          beforeEach(function() {
            Super = new Posture.Class({
              Name: "Super",
              superMethod: function superMethod() {},
              overrideMe: function overrideMe() {
                return "super";
              }
            });

            Child = new Posture.Class({
              Name: "Child",
              Extends: Super,
              overrideMe: function overrideMe() {
                return "child";
              }
            });

            instance = new Child();

          });

          it("should properly connect the prototype chain to inherit from a parent class", function() {
            expect(Super.prototype.isPrototypeOf(instance)).toBe(true);
          });

          it("should still work if the parent class is a regular constructor function", function() {
            var Super = function() {};
            Super.prototype = {
              constructor: Super,
              superMethod: function superMethod() {}
            };

            var Child = new Posture.Class({
              Extends: Super
            });

            var instance = new Child();

            expect(typeof instance.superMethod).toBe("function");

          });

          it("should allow methods on the parent class to be called", function() {
            expect(instance.superMethod).toBeDefined();
          });

          it("should allow overriding of methods", function() {
            expect(instance.overrideMe()).toBe("child");
          });

          it("should add a superClass property to the instance _meta object that points to the super class ", function() {
            expect(instance._meta.superClass).toBe(Super);
          });
        });

        describe("Includes: Mixin other objects and classes", function() {
          var Class, objectMixin, functionMixin, classDefinition, instance;

          beforeEach(function() {

            objectMixin = {
              initialize: function() {},
              objectMethod: function() {}
            };

            functionMixin = function () {};

            functionMixin.prototype = {
              initialize: function() {},
              functionMethod: function() {}
            };

          });

          it("includes array should be defined on the Class instance _meta object", function() {
            Class = Posture.Class.create();
            expect(_.isArray(Class._meta.includes)).toBe(true);
          });

          it("should extend the class instance prototype with an object mixin and exclude the initialize method of the mixin", function() {
            classDefinition = {
              Includes: [objectMixin],
              initialize: function initialize() {}
            };

            Class = Posture.Class.create(classDefinition);

            expect(Class.prototype.initialize).toBe(classDefinition.initialize);
            expect(Class._meta.includes[0]).toBe(objectMixin);
            expect(Class.prototype.objectMethod).toBe(objectMixin.objectMethod);
          });

          it("should also extend the class instance prototype with a constructor function prototype", function() {
            classDefinition = {
              Includes: [functionMixin],
              initialize: function initialize() {}
            };

            Class = Posture.Class.create(classDefinition);

            expect(Class._meta.includes[0]).toBe(functionMixin);
            expect(Class.prototype.functionMethod).toBe(functionMixin.prototype.functionMethod);
          });

          it("should work when including multiple mixins", function() {
            classDefinition = {
              Includes: [objectMixin, functionMixin],
              initialize: function initialize() {}
            };

            Class = Posture.Class.create(classDefinition);

            expect(Class._meta.includes[0]).toBe(objectMixin);
            expect(Class._meta.includes[1]).toBe(functionMixin);

            expect(Class.prototype.objectMethod).toBeDefined();
            expect(Class.prototype.functionMethod).toBeDefined();
          });

          it("should not cause two separate classes to include the same mixins", function() {
            classDefinition = {
              Includes: [objectMixin, functionMixin],
              initialize: function initialize() {}
            };

            Class = Posture.Class.create(classDefinition);

            var ClassB = Posture.Class.create({});

            expect(ClassB._meta.includes.length).toBe(0);
          });

          it("should extend the class instance prototype with mixin properties before class definition properties so that classes can override mixin methods", function() {
            objectMixin = {
              initialize: function() {},
              objectMethod: function() {
                this.onObjectMethod();
              },
              onObjectMethod: function() {}
            };

            classDefinition = {
              Includes: [objectMixin],
              initialize: function initialize() {
              },

              onObjectMethod: function() {}
            };

            Class = Posture.Class.create(classDefinition);

            expect(Class.prototype.onObjectMethod).toBe(classDefinition.onObjectMethod);
          });
        });

        describe("ClassProperties: Add the specified class properties to the class as singleton methods", function() {
          it("should extend the Class with the specified singleton properties", function() {

            var classProperties = {
              classMethod: function() {}
            };

            var classDefinition = {
              ClassProperties: classProperties
            };

            var Class = Posture.Class.create(classDefinition);

            expect(Class.classMethod).toBe(classProperties.classMethod);

            var instance = new Class();
            expect(instance.classMethod).toBeUndefined();
          });
        });
      });

      describe("Class Instances", function() {
        var Class, instance, mixin1, mixin2, classDefinition;

        beforeEach(function() {
          mixin1 = {
            initialize: function() {
              this._init = ["mixin1"];
            },

            mixin1Method: function() {}
          };

          mixin2 = {
            initialize: function() {
              this._init.push("mixin2");
            },
            mixin2Method: function() {}
          };

          classDefinition = {
            Name: "Bogus.Component",
            Includes: [mixin1, mixin2],
            initialize: function() {
              this._init = this._init || [];
              this._init.push("class");
              this._initArgs = _.toArray(arguments);
            }
          };


          Class = Posture.Class.create(classDefinition);
          instance = new Class();
        });

        describe("new", function() {
          it ("should call the initialize method of the class definition after calling initialize on all mixins and proxying any arguments", function() {
            spyOn(mixin1, "initialize").andCallThrough();
            spyOn(mixin2, "initialize").andCallThrough();


            instance = new Class("arg1", "arg2");

            expect(instance._init.toString()).toBe("mixin1,mixin2,class");

            expect(mixin1.initialize.calls[0].args).toEqual(["arg1", "arg2"]);
            expect(mixin2.initialize.calls[0].args).toEqual(["arg1", "arg2"]);
            expect(instance._initArgs).toEqual(["arg1", "arg2"]);

          });

          it ("should set an array property called included on the _meta object and all all included mixins", function() {
            expect(_.isArray(instance._meta.included)).toBe(true);
            expect(instance._meta.included[0]).toBe(mixin1);
            expect(instance._meta.included[1]).toBe(mixin2);
          });

        });

        describe("type()", function() {
          it("should return the type of the class instance", function() {
            expect(instance.type()).toBe("Component");
          });
        });

        describe("namespace()", function() {
          it("should work", function() {
            expect(instance.namespace()).toBe("Bogus.Component");
          });
        });

        describe("include(mixin)", function() {
          it("should mixin an object if it hasn't already been mixed in", function() {
            var mixin = {
              initialize: function() {
                this.isMixinIncluded = true;
              },
              anotherMethod: function() {}
            };

            instance.include(mixin, "arg1", "arg2");

            expect(instance._meta.included.length).toBe(3);
            expect(instance.anotherMethod).toBe(mixin.anotherMethod);
            expect(instance.isMixinIncluded).toBe(true);
          });

          it("should not mixin an object if it has already been mixed in through the class", function() {
            instance.include(mixin1);
            expect(instance._meta.included.length).toBe(2);
          });

          it("should not call the initialize method on a mixin if the mixin has already been included", function() {
            var count = 0;
            var mixin = {
              initialize: function() {
                this.mixinCount = ++count;
              }
            };

            instance.include(mixin);
            expect(instance.mixinCount).toBe(1);
            instance.include(mixin);
            expect(instance.mixinCount).toBe(1);
          });

          it ("should not impact other instances", function() {
            var count = 0;
            var mixin = {
              initialize: function() {
                this.mixinCount = ++count;
              }
            };

            instance.include(mixin);

            var instanceB = new Class();

            expect(instanceB._meta.included.length).toBe(2);
          });
        });

        describe("collectPrototypes()", function() {
          it("should return an array of all objects in the prototype chain", function() {
            var SubClass, result;
            SubClass = Class.extend();
            instance = new SubClass();
            result = instance.collectPrototypes();
            expect(result).toEqual([SubClass.prototype, Class.prototype, Object.prototype]);
          });
        });

        describe("collectClasses()", function() {
          it("should return an array of all classes in the class chain", function() {
            var SubClass, result;
            SubClass = Class.extend();
            instance = new SubClass();
            result = instance.collectClasses();
            expect(result).toEqual([SubClass, Class]);
          });
        });

        describe("collectPrototypePropertyValues(property, direction)", function() {
          var SubClass;

          beforeEach(function() {
            Class = Posture.Class.create({
                classNames: ["first"],
                style: {first: true}
              });
            SubClass = Class.extend({
                classNames: ["second"],
                style: {first: false, second: true, third: true}
            });
          });

          describe("direction is up", function() {
            it ("should return an array of all the property values starting with 'this' object and working up the prototype chain", function() {
              instance = new SubClass();
              instance.classNames = ["object"];
              expect(instance.collectPrototypePropertyValues("classNames", "up")).toEqual(["object", "second", "first"]);
            });
          });

          describe("direction is down", function() {
            it ("should return an array of all the property values starting at the top and working down to 'this'", function() {
              instance = new SubClass();
              instance.classNames = ["object"];
              expect(instance.collectPrototypePropertyValues("classNames", "down")).toEqual(["first", "second", "object"]);
            });
          });
        });

        describe("mergePrototypePropertyValues(initial, property)", function() {
          var SubClass;

          beforeEach(function() {
            Class = Posture.Class.create({
                classNames: ["first"],
                style: {first: true}
              });
            SubClass = Class.extend({
                classNames: ["second"],
                style: {first: false, second: true, third: true}
            });
          });

          it ("should merge all prototype property values that are objects into one object and return it", function() {
            instance = new SubClass();
            var defaults = { defaults: true };
            var result = instance.mergePrototypePropertyValues(defaults, "style");
            expect(typeof result).toBe("object");
            expect(result.first).toBe(false);
            expect(result.second).toBe(true);
            expect(result.third).toBe(true);
          });
        });
      });

    });

  });

  return Posture;
});