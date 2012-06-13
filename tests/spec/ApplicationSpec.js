define(["Posture/Application"], function(Posture) {

  describe("Posture.Application", function() {
    it ("should be defined", function() {
      expect(typeof Posture.Application).toBe("function");
    });
    
    describe("Instance Behavior", function() {
      it ("should have default namespace properties for components, views, models, collections and utils", function() {
        var inst = new Posture.Application();
        expect(inst.views).toBeDefined();
        expect(inst.components).toBeDefined();
        expect(inst.models).toBeDefined();
        expect(inst.collections).toBeDefined();
        expect(inst.utils).toBeDefined();
      });
    });
  });
  
});