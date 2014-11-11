var initMDIcon = function(MDIcon, materializer) {
  MDIcon.attributeChangedCallback = function(attrname, oldvalue, newvalue) {
    console.log("CHANGED ATTRIBUTE " + attrname + " VALUE " + newvalue);
    if(this.tagName==='MD-ICON') {
      if(attrname==='md-image' && newvalue!="") {
        var svgFileURI = materializer.path + "md-resources/icon/" + newvalue + ".svg";
        loadSVG(svgFileURI, this);
      }
    } else {
      if(attrname==='md-image' && newvalue!="") {
        var imgFileURI = newvalue;
        var svgData = avatarSVG.replace('$$IMAGE$$', imgFileURI);
        replaceSVG(svgData, this);
      } else if(attrname==='md-image') {
        var svgFileURI = materializer.path + "md-resources/icon/account_circle.svg";
        loadSVG(svgFileURI, this);
      }
    }
  };

var avatarSVG= "<svg width=\"40\" height=\"40\">"+
          "<defs>" +
            "<pattern id=\"image\" x=\"0\" y=\"0\" patternUnits=\"userSpaceOnUse\" height=\"40\" width=\"40\">"+
              "<image x=\"0\" y=\"0\" height=\"40\" width=\"40\" xlink:href=\"$$IMAGE$$\"></image>"+
            "</pattern>"+
          "</defs>"+
          "<circle id=\"top\" cx=\"20\" cy=\"20\" r=\"20\" fill=\"url(#image)\"/>"+
        "</svg>";

  var createSVG= function(svgData) {
      var div = document.createElement('div');
      div.innerHTML = svgData;
      var svg = div.children[0];
      div.removeChild(svg);
      return svg;
  }

  var replaceSVG= function(svgData, element) {
    var newSVG = createSVG(svgData);
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
  }

  var loadSVG= function(svgName, element) {
    var svg;
    var xhr= new XMLHttpRequest;
    xhr.open("GET", svgName, true);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.addEventListener("load",function(){ replaceSVG(xhr.responseText, element); });
    xhr.send();
  }

  // Init image
  MDIcon.attributeChangedCallback('md-image','', MDIcon.getAttribute('md-image') ? MDIcon.getAttribute('md-image'): '');

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