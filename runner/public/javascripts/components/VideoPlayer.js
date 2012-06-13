Posture.Class.create({
  Name: "VideoPlayer",
  Extends: Posture.Component,
  
  childrenLayout: null,
    
  children: {
    "video": {
      factory: Posture.elements.Video,
      events: {
        "play"
      }
    }
  }
  
});