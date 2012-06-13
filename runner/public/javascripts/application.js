require.config({
  baseUrl: "javascripts/lib"
});

require(["Posture/Application"], function(Posture) {
  
  window.Posture = Posture;
  
  App = new Posture.Application({
    bogus: new Posture.Namespace()
  });
});