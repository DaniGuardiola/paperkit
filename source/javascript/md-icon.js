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
      div.removeChild(svg);
      return svg;
  }

  var replaceSVG= function(svgName, element) {
    var svg;
    var xhr= new XMLHttpRequest;
    xhr.open("GET", svgName, true);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.addEventListener("load",function(){
        var newSVG = createSVG(xhr.responseText);
        var oldSVG = element.children[0];

        if(oldSVG) {
          // Si hay svg antiguo, se le pone opacidad 0
          oldSVG.style.opacity="0";
          // Se elimina cuando la transición acaba
          oldSVG.addEventListener(transitionend, function(e) {
            element.removeChild(oldSVG);
          });
          // Se inicializa el nuevo svg desde opacity 0
          newSVG.style.opacity="0";
        }
        // Se añade, independientemente de si había svg antiguo o no
        element.appendChild(newSVG);        
        // element.innerHTML = xhr.responseText;
        // Se elimina la opacity 0 inline, por lo que transiciona al opacity 1 del propio elemento
        setTimeout(function(){
          newSVG.style.opacity="";
          console.log("hola?");
        },50);
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