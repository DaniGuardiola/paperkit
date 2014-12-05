var Materializer= function() {
  this.path = '';
  this.initFuncs = new Array();

  /* Elements */
  this.greylayer = null;
  this.sidemenu = null;
  this.fab = null;
  this.content = null;

  this.observer = null;
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
    //console.log("ELEMENTOS ESTATICO " + length + " ELEMENTOS DINAMICO " + elements.length);
    var el = elements[i];
    //console.log("ENCONTRADO " + el.tagName);
    if(el.tagName.indexOf('MD') === 0) {
      //console.log("VOY A PROCESAR " + el.tagName);
      this.addMDMethods(el);
      //console.log("PROCESADO " + el.tagName);
    }    
  }

  // Mutation observer initializing...
  this.observer = new MutationObserver(this.observeMDElements);
  var config = { attributes: false, childList: true, characterData: false, subtree: true };
  this.observer.observe(document.body, config);

  this.initFuncs.forEach(function(initFunc){
    initFunc();
    //var loadEvent = new Event('md-load');
    //window.dispatchEvent(loadEvent);
  });
};

Materializer.prototype.addMDMethods= function(element) {
  var tag = element.tagName.toLowerCase();

  if(tag.indexOf("md-") >= 0) {
    if(element.alreadyInitialized) {
      //console.log("ELEMENT " + element.tagName + " ALREADY INITIALIZED");
      return;
    }
    // INCICIALIZACION DE FUNCIONES GENERALES
    initGlobalMDFunctions(element, this);

    if(tag=="md-snackbar") {
      initMDSnackBar(element, this);
    } else if(tag=="md-button") {
      initMDButton(element, this);
    } else if(tag=="md-input-submit") {
      initMDInputSubmit(element, this);
    } else if(tag=="md-input") {      
      initMDInput(element, this);
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
    } else if(tag=="md-menu") {
      initMDMenu(element, this);
    } else if(tag=="md-tabbar") {
      initMDTabBar(element, this);
    } else if(tag=="md-toolbar") {
      initMDToolBar(element, this);
      this.toolbar = element;
    } else if(tag=="md-switch") {
      initMDSwitch(element, this);
    } else if(tag=="md-fab") {
      initMDFab(element, this);
      this.fab = element;
    } else if(tag=="md-content") {
      this.content = element;
    }
  }
};

Materializer.prototype.create= function(what,opt){
  if (what === "snackbar") {
    var newSnackbar = document.createElement('md-snackbar');
    if (opt.text) {
      var text = document.createElement('md-text');
      text.innerText = opt.text;
      newSnackbar.appendChild(text);
    }
    if (opt.position) {
      newSnackbar.setAttribute('md-position',opt.position);
    } else {
      newSnackbar.setAttribute('md-position','bottom right');
    }
    document.body.appendChild(newSnackbar);
    initMDSnackBar(newSnackbar);
  }
};

Materializer.prototype.observeMDElements = function(mutations) {
  var mat = this;

  mutations.forEach(function(mutation) {
    if(mutation.type === 'childList') {
      [].forEach.call(mutation.addedNodes, function(node) {
        if(!node.tagName) {
          //console.log("ADDED NODE " + node);
          return;
        }
        if(node.tagName.indexOf("MD-") === 0) {
          //console.log("ADDED NODE (%s), INITIALIZING.", node.tagName);
          Materializer.prototype.addMDMethods(node);
        }
      });
    }
  });
}


var properties = {
  logEnabled: false,
  log: function(what){
    if (properties.logEnabled) {
      //console.log(what);
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
       //console.log(args);
       var namespaces = functionName.split(".");
       var func = namespaces.pop();
       if (!context) {
           var context = window;
       }
       for (var i = 0; i < namespaces.length; i++) {
           context = context[namespaces[i]];
       }
       if (args) {
           return context[func].apply(this, args);
       } else {
           return context[func].apply(this, ['false']);
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

var isMobile = function() {
  if (getViewport().width < 768) {
    return true;
  } else {
    return false;
  }
}


Materializer.prototype.justInCase= function(dowhat){
  if (dowhat=="reload") {
    var elements = document.getElementsByTagName('*');
    var length = elements.length;
    for(var i=0; i<elements.length; i++) {
      //console.log("ELEMENTOS ESTATICO " + length + " ELEMENTOS DINAMICO " + elements.length);
      var el = elements[i];
      //console.log("ENCONTRADO " + el.tagName);
      if(el.tagName.indexOf('MD') === 0) {
        //console.log("VOY A PROCESAR " + el.tagName);
        this.addMDMethods(el);
        //console.log("PROCESADO " + el.tagName);
      }    
    }
  }
}

Materializer.prototype.ajaxInsert= function(what, where, onload, param) {
  var xhr = new XMLHttpRequest;
  xhr.open("GET", what);
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  where.classList.add('op-0-child');
  xhr.addEventListener('load',function(){
    getEl(where).innerHTML = xhr.responseText;
    setTimeout(function(){
      where.classList.add('op-1-child');
      where.classList.remove('op-0-child');
      setTimeout(function(){
        where.classList.remove('op-1-child');
      },750);
    },250);
    onload(xhr.responseText,where);
  });
  xhr.send();
}

Materializer.prototype.consoleBanner= "M! ";