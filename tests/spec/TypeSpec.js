define(["Posture/Type"], function(Posture) {
  
  describe("Posture.Type", function() {
    
    
    it ("should be defined", function() {
      expect(Posture.Type).toBeDefined();
    });
    
    it ("should return the passed in constructor function", function() {
      function Constructor() {};
      var Class = new Posture.Type("Class", Constructor);
      expect(Class).toBe(Constructor);
    });
    
    describe("Type Constructor Function Properties", function() {
      it ("should add a getType method to the constructor function that returns 'Type'", function() {
        function Ctor() {};
        var Class = new Posture.Type("Class", Ctor);
        expect(Class.getType()).toEqual("Type");
      });

      it ("should add a create method to the constructor function that returns a new Type instance", function() {
        function Ctor() {};
        var Class = new Posture.Type("Class", Ctor);
        var instance = Class.create();
        expect(instance.__proto__).toBe(Class.prototype);
      });
      
      it ("should add an empty object _meta property to the constructor function", function() {
        function Ctor() {};
        var Class = new Posture.Type("Class", Ctor);
        expect(typeof Class._meta).toBe("object");
      });
      
      it ("should allow you to create new instances of the Type with the new operator", function() {
        function Ctor() {};
        var Class = new Posture.Type("Class", Ctor);
        var instance = new Class();
        expect(instance.__proto__).toBe(Class.prototype);
        expect(instance.getType).toBeDefined();
      });
    });
    
    describe("Type Instances", function() {
      
      it ("should call the constructor function when new instances of the Type are created", function() {
        
        var harness = {
          constructor: function() {}
        };
        
        spyOn(harness, "constructor");
        var Class = new Posture.Type("Class", harness.constructor);
        var instance = new Class();
        expect(harness.constructor).toHaveBeenCalled();
      });
      
      it ("should add a getType method to Type instances that returns the name of the type", function() {
        function Ctor() {};
        var Class = new Posture.Type("Class", Ctor);
        var instance = new Class();
        expect(instance.getType()).toEqual("Class");
      });
      
      it ("should add an empty object _meta property to the instance", function() {
        function Ctor() {};
        var Class = new Posture.Type("Class", Ctor);
        var instance = new Class();
        expect(typeof instance._meta).toBe("object");
        expect(instance._meta).not.toBe(Class._meta);
      });

    });

  });
  
  return Posture;
});