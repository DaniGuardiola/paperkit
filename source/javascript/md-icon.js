var initMDIcon = function(MDIcon, materializer) {
  MDIcon.attributeChangedCallback = function(attrname, oldvalue, newvalue) {
    console.log("CHANGED ATTRIBUTE " + attrname + " VALUE " + newvalue);
    if(attrname==='md-image' && newvalue!="") {
      var image=this.getAttribute('md-image');
      var svgFileURI = materializer.path + "md-resources/icon/" + newvalue + ".svg";
      replaceSVG(svgFileURI, this);
    }
  };

  var createSVG= function(svgData) {
      var div = document.createElement('div');
      div.innerHTML = svgData;
      var svg = div.children[0];
      return svg;
  }

  var replaceSVG= function(svgName, element) {
    var svg;
    var xhr= new XMLHttpRequest;
    xhr.open("GET", svgName, false);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.addEventListener("load",function(){
        var newSVG = createSVG(xhr.responseText);
        var oldSVG = element.children[0];

        if(oldSVG) {
          oldSVG.style.opacity="1";
          oldSVG.style.transition='opacity 0.25s';
          oldSVG.style.opacity="0";
          oldSVG.addEventListener(transitionend, function(e) {
            element.removeChild(oldSVG);
          });
          newSVG.style.transition="opacity 0.25s";
        } else {
          newSVG.style.transition="";
        }
        element.appendChild(newSVG);
        element.style.opacity="1";
    });
    xhr.send();
  }

  // Init image
  if(MDIcon.getAttribute('md-image')) {
    MDIcon.attributeChangedCallback('md-image','', MDIcon.getAttribute('md-image'));
  }

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