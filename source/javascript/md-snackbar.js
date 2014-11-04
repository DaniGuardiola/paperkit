Element.prototype.addMDMethods= function() {
  var tag = this.tagName.toLowerCase();

  if(tag.indexOf("md-") >= 0) {
    // INCICIALIZACION DE FUNCIONES GENERALES

    if(tag=="md-snackbar") {
      initSnackBar(this);
    } else if(tag=="md-input-checkbox") {
      initInputBox(this);
    } else if(tag=="md-input-submit") {
      initMDInputSubmit(this);
    }
  }
}

var initSnackBar = function(MDSnackBar) {
  var observer = new MutationObserver(MDSnackBar.callback);
  var config = { attributes: true, childList: false, characterData: false };
  observer.observe(MDSnackBar, config);

  MDSnackBar.animationIn=function() {
    var position = this.getAttribute('md-position');

    if(!this.hasAttribute('md-notanimated')) {
      if(position.split(' ').indexOf('bottom') != -1) {    
          this.style.transitionProperty='bottom, opacity';
          this.style.transitionDuration="0.25s, 0.5s";      
          this.style.bottom="24px";
          this.style.opacity="1";
      } else {
          this.style.transitionProperty='top, opacity';
          this.style.transitionDuration="0.25s, 0.5s";      
          this.style.top="24px";
          this.style.opacity="1";      
      }
    }  
  }

  MDSnackBar.animationOut=function() {
    var position = this.getAttribute('md-position');

    if(!this.hasAttribute('md-notanimated')) {
      if(position.split(' ').indexOf('bottom') != -1) {    
          this.style.transitionProperty='opacity';
          this.style.transitionDuration="0.5s";      
          this.style.opacity="0";
      } else {
          this.style.transitionProperty='opacity';
          this.style.transitionDuration="0.5s";      
          this.style.opacity="0";      
      }
    }
  }

  MDSnackBar.animate=function() {
    this.animationIn();
    var _this = this;
    setTimeout(function() {
      _this.animationOut();
    }, 2000);
  }

  MDSnackBar.callback = function(mutations) {
    mutations.forEach(function(mutation) {
      console.log(mutation);
    });
  }

  MDSnackBar.createdCallback = function() {
    var action = this.getAttribute('md-action');

    if(action) {
      this.attributeChangedCallback('md-action', '', action);
    }
  }

  MDSnackBar.attributeChangedCallback = function(attrname, oldvalue, newvalue) {
    if(attrname=="md-action") {
      var actionbutton = this.querySelector('#action');

      if(!actionbutton) {
        actionbutton = document.createElement('span');
        actionbutton.id = "action";
        actionbutton.innerText = newvalue;
        this.appendChild(actionbutton);
      } else {
        actionbutton.id = "action";
        actionbutton.innerText = newvalue;      
      }
    }
  }
}
/*
document.registerElement('md-snackbar', {
  prototype: MDSnackBar
});
*/