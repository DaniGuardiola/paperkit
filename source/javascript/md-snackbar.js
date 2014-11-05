var initSnackBar = function(MDSnackBar) {
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
  };  

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
  };

  MDSnackBar.animationEnd = function() {
    var position = this.getAttribute('md-position');

    if(!this.hasAttribute('md-notanimated')) {
      if(position.split(' ').indexOf('bottom') != -1) {    
          this.style.transitionProperty='';
          this.style.transitionDuration="";      
          this.style.bottom="-24px";
      } else {
          this.style.transitionProperty='';
          this.style.transitionDuration="";      
          this.style.top="-24px";      
      }
    }

    this.removeEventListener(transitionend, this.animationEnd);
  };

  MDSnackBar.animate=function() {
    this.animationIn();
    var _this = this;
    setTimeout(function() { 
      _this.animationOut(); 
      _this.addEventListener(transitionend, _this.animationEnd);
    }, 2000);
  };

  MDSnackBar.createdCallback = function() {
    var action = this.getAttribute('md-action');

    if(action) {
      this.attributeChangedCallback('md-action', '', action);
    }
  };

  MDSnackBar.attributeChangedCallback = function(attrname, oldvalue, newvalue) {
    if(attrname=="md-action") {
      /*
      var actionbutton = this.querySelector('#action');
      console.log("CHANGED ATTRIBUTE " + attrname + " VALUE " + newvalue);

      if(!actionbutton) {
        actionbutton = document.createElement('button');
        actionbutton.id = "action";
        actionbutton.value = newvalue;
        // actionbutton.textContent = newvalue;
        this.appendChild(actionbutton);
      } else {
        actionbutton.id = "action";
        actionbutton.value = newvalue;      
      }
      */
    }
  };

  // SET INITIAL PROPERTIES
  if(MDSnackBar.getAttribute('md-action')) {
    MDSnackBar.attributeChangedCallback('md-action', '', MDSnackBar.getAttribute('md-action'));
  }

  // INIT OBSERVER
  var observer = new MutationObserver(function(mutations) { 
      mutations.forEach(function(mutation) {
        var element = mutation.target;
        element.attributeChangedCallback(mutation.attributeName, mutation.oldvalue, element.getAttribute(mutation.attributeName));
      });
  });

  var config = { attributes: true, childList: false, characterData: false };
  observer.observe(MDSnackBar, config);
}