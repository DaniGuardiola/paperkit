var initMDIcon = function(MDIcon, materializer) {
  MDIcon.attributeChangedCallback = function(attrname, oldvalue, newvalue) {
    console.log("CHANGED ATTRIBUTE " + attrname + " VALUE " + newvalue);
    if(attrname==='md-image' && newvalue!="") {
      var image=this.getAttribute('md-image');

      var oldsvg = this.children[0];
      oldsvg.style.opacity="1";
      oldsvg.style.transition='opacity 0.25s';
      oldsvg.style.opacity="0";      

      var _this=this;
      setTimeout(function(e) {
        _this.removeChild(oldsvg);
      },250); 

      var svg = document.createElement('object');
      svg.setAttribute("type", "image/svg+xml");
      svg.setAttribute("data", materializer.path + "md-resources/icon/" + newvalue + ".svg");
      svg.style.opacity="0";
      svg.style.transition='opacity 0.25s';
      this.appendChild(svg);
      svg.style.opacity="1";
    }
  };

  // INIT OBSERVER
  var observer = new MutationObserver(function(mutations) { 
      mutations.forEach(function(mutation) {
        var element = mutation.target;
        element.attributeChangedCallback(mutation.attributeName, mutation.oldvalue, element.getAttribute(mutation.attributeName));
      });
  });

  var config = { attributes: true, childList: false, characterData: false };
  observer.observe(MDIcon, config);
}