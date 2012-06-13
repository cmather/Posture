define(["Posture/Core"], function(Posture) {
  
  describe("Posture/Core", function() {
    it ("should be defined", function() {
      expect(Posture).toBeDefined();
    });
    
    it ("should define lodash as an underscore", function() {
      expect(Posture._).toBeDefined();
    });
    
    describe("createNamespace(namespace, object, context)", function() {
      it ("should create a namespace and return the final object in the namespace", function() {
        var context = {}, object, namespace;
        
        namespace = "Posture.elements.Button";
        
        object = {
          name: "My Object"
        };
        
        var ns = Posture.createNamespace(namespace, object, context);
        
        expect(ns.target).toBe(object);
        expect(ns.namespace).toBe(namespace);
        expect(ns.type).toBe("Button");
        
        expect(context.Posture).toBeDefined();
        expect(context.Posture.elements).toBeDefined();
        expect(context.Posture.elements.Button).toBeDefined();
        
        expect(context.Posture.__proto__).toBeNull();
      });
    });
    
    describe("Lodash Mixins", function() {
      it ("_.exclude: should return a new object excluding any specified properties", function() {
        var source, target;
        
        source = {
          one: true,
          two: true,
          three: true
        };
        
        target = _.exclude(source, "two", "three");
        
        expect(target.two).toBeUndefined();
        expect(target.three).toBeUndefined();
        expect(target.one).toBe(true);
      });
    });
  });
  
});