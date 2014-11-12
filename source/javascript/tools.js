var Materializer= function() {
  this.path = '';
  this.initFuncs = new Array();

  /* Elements */
  this.greylayer = null;
  this.sidemenu = null;
}

Materializer.prototype.initListener= function(func) {
  this.initFuncs.push(func);
}

Materializer.prototype.init= function() {
  // Init materializer path
  var url = document.querySelector("link[href*='materializer.css']").href;
  this.path = url ? url.substring(0, url.indexOf('materializer.css')) : '';

  // Init elements
  if (!document.querySelector('md-greylayer')) {
    document.body.appendChild(document.createElement('md-greylayer'));
  }

  // Init materializer objects
  var elements = document.getElementsByTagName('*');
  var length = elements.length;
  for(var i=0; i<elements.length; i++) {
    console.log("ELEMENTOS ESTATICO " + length + " ELEMENTOS DINAMICO " + elements.length);
    var el = elements[i];
    console.log("ENCONTRADO " + el.tagName);
    if(el.tagName.indexOf('MD') === 0) {
      console.log("VOY A PROCESAR " + el.tagName);
      this.addMDMethods(el);
      console.log("PROCESADO " + el.tagName);
    }    
  }

  this.initFuncs.forEach(function(initFunc){
    initFunc();
  });
};

Materializer.prototype.addMDMethods= function(element) {
  var tag = element.tagName.toLowerCase();

  if(tag.indexOf("md-") >= 0) {
    // INCICIALIZACION DE FUNCIONES GENERALES
    initGlobalMDFunctions(element, this);

    if(tag=="md-snackbar") {
      initMDSnackBar(element, this);
    } else if(tag=="md-button" || tag=="md-icon-button") {
      initMDButton(element, this);
    } else if(tag=="md-input-submit") {
      initMDInputSubmit(element, this);
    } else if(tag=="md-list") {
      initMDList(element, this);
    } else if(tag=="md-icon" || tag=="md-avatar") {
      initMDIcon(element, this);
    } else if(tag=="md-sidemenu") {
      initMDSidemenu(element, this);
      this.sidemenu = element;
    } else if(tag=="md-icon-button") {
      initMDIconButton(element, this);
    } else if(tag=="md-greylayer") {
      initMDGreylayer(element, this);
      this.greylayer = element;
    }
  }
};


var properties = {
  logEnabled: false,
  log: function(what){
    if (properties.logEnabled) {
      console.log(what);
    }
  },
  change: function(element,classOut,classIn){
    if (element) {
      if (classOut) {
        if (element.classList.contains(classOut)) {
          element.classList.remove(classOut);
        }
      }
      if (classIn) {
        if (element.classList.contains(classIn) != true) {
          element.classList.add(classIn);
        }
      }
      // properties.log("properties.change | " + query);
    } else {
      // properties.log("!! properties.change | query not specified or not valid");
    }
  }
}

var transitionEndEventName= function() {
    var i,
        undefined,
        el = document.createElement('div'),
        transitions = {
            'transition':'transitionend',
            'OTransition':'otransitionend',  // oTransitionEnd in very old Opera
            'MozTransition':'transitionend',
            'WebkitTransition':'webkitTransitionEnd'
        };

    for (i in transitions) {
        if (transitions.hasOwnProperty(i) && el.style[i] !== undefined) {
            return transitions[i];
        }
    }
}

var transitionend = transitionEndEventName();

var executeFunctionByName= function(functionName, context, args) {
       console.log(args);
       var namespaces = functionName.split(".");
       var func = namespaces.pop();
       for (var i = 0; i < namespaces.length; i++) {
           context = context[namespaces[i]];
       }
       if (args) {
           return context[func].apply(this, args);
       } else {
           return context[func];
       }
   }

var getViewport = function() {
  var e = window;
  var a = 'inner';
  if ( !( 'innerWidth' in window ) )
    {
      a = 'client';
      e = document.documentElement || document.body;
    }
  return { width : e[ a+'Width' ] , height : e[ a+'Height' ] }
}
