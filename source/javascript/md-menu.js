var initMDMenu = function(MDMenu) {
  MDMenu.status = "closed";
  MDMenu.parent = null;

  /**
   * Inits the menu.
   * Sets width according to options and multiple widths.
   */
  MDMenu.init= function() {
    this.status="closed";
    this.generateWidth();
  }

  /**
   * Generates and sets the menu width.
   */
  MDMenu.generateWidth= function() {
    var stepWidth     = isMobile() ? 56: 64;
    var originalWidth = this.getBoundingClientRect().width;
    var steps = Math.ceil(originalWidth / stepWidth);
    this.style.width = ((steps * stepWidth) < 2 ? 1.5 : (steps * stepWidth)) + "px";
  }

  /**
   * Open this menu related to a parent icon
   * @param {Element} parent Parent icon.
   */
  MDMenu.parentIconOpen= function(parent) {
    var parentRect= parent.getBoundingClientRect();
    var viewPort= getViewport();

    this.style.right=(viewPort.width - parentRect.right) + "px";
    this.style.top= parentRect.top + "px";
  }

  /**
   * Open related to a parent input select
   * TODO: REVIEW TOO MANY HARDCODED VALUES!!!?!??!?!?!
   * @param {Element} parent Parent input select
   */
  MDMenu.parentInputSelectOpen= function(parent) {
    var parentRect= parent.getBoundingClientRect();
    var viewPort= getViewport();

    this.style.maxHeight= "200px";
    this.style.overflow= "auto";
    this.style.left= (parentRect.left - 16) + "px";
    this.style.top= (parentRect.top - 6) + "px";

    if(this.children.length<5 || true) {
      if(this.querySelector('md-list> md-tile.selected')) {
        var selected = this.querySelector('md-list> md-tile.selected');
        this.scrollTop = selected.offsetTop - 8;
        if (this.scrollTop != selected.offsetTop) {
          this.style.top= (parseInt(this.style.top) - (selected.offsetTop - this.scrollTop - 8)) + 'px';
        }
      }
    }

    menuRect = this.getBoundingClientRect();
    if(menuRect.top < 32) {
      this.style.top = '32px';
    } else if (viewPort.height - menuRect.bottom < 32) {
      this.style.top = (viewPort.height - 32 - menuRect.height) + 'px';
    }
  }

/** 
 * This code should not be here....
    opt.selectEl.spanText.innerText = tile.querySelector('md-text').innerText;
    opt.selectEl.querySelector('[selected]').removeAttribute('selected');
    opt.selectEl.querySelector('[value="' + el.getAttribute('value') + '"]').setAttribute('selected','');
    opt.selectEl.setAttribute('value',el.getAttribute('value'));
*/

  /**
   * Listener for menu click events.
   * Calls custom functions.
   * @param {Event} e Event object. @see {url https://developer.mozilla.org/en-US/docs/Web/API/Event}
   */
  MDMenu.clickListener = function(e) {
    var el = e.currentTarget;
    
    if(this.status==="opened") {
      if(this.contains(el)) {     // Click was done in a child of this
        if(el.tagName==='MD-TILE' && parentElement===this) {
          var action = el.getAttribute("md-action") ? el.getAttribute('md-action') : 'submit';
          
          switch(action) {
            default:
              if(action.indexOf('custom:') != -1) {
                var f = action.substring(action.indexOf('custom:') + 'custom:'.length).trim();
                el.callFunction(f, el);
              }
              break;
          }   
        }      
      } else {
        this.close(false);
      }
    }
  }

  /**
   * Opens the menu.
   * @param {Element} parent Parent element this menu depends on.
   */
  MDMenu.open = function(parent) {
    if(parent) {
      this.parent = parent;
    }

    var openMode= this.getAttribute("md-position"); 

    if(openMode==="parentInputSelect") {
      this.parentInputSelectOpen(parent);
    } else if(openMode==="parentIcon") {
      this.parentIconOpen(parent);
    } else {  // Simply show up.
      this.style.display="";
    }

    // Animation
    // TODO: This is single animation for all openings, maybe make it more personalized.    
    this.style.height="";
    this.setAttribute('md-status','opened');
    document.addEventListener('click', this.clickListener.bind(this));
    this.status = "opened";
  }

  /**
   * Closes the menu.
   * @param {boolean} Optionally destroy menu element...
   */
  MDMenu.close = function(destroy) {
    this.style.height = "0px";
    this.addEventListener(transitionend, MDMenu.endOfTransition.bind(this));
    this.setAttribute('md-status','opened');
    this.status= "closed";
    // TODO: Review, shouldn't this be done by parent????
    if (destroy && (destroy == true || (destroy.nodeType && destroy.getAttribute('menu-destroy') == "true"))) {
      MDMenu.parentNode.removeChild(MDMenu);
    }
  }

  /**
   * Switches menu state from open to closed and viceversa
   */
  MDMenu.switch = function() {
    if (this.getAttribute('md-state') !== "open") {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Listener for end of transition.
   * @param {Event} e Event object @see {url https://developer.mozilla.org/en-US/docs/Web/API/Event}
   */
  MDMenu.endOfTransition = function(e) {
    this.style.display="none";
    this.removeEventListener(transitionend, MDMenu.endOfTransition);
  }

 
  MDMenu.attributeChangedCallback = function(attrname, oldvalue, newvalue) {
    console.log("CHANGED ATTRIBUTE " + attrname + " VALUE " + newvalue);
  };

  // INIT OBSERVER
  var observer = new MutationObserver(function(mutations) { 
      mutations.forEach(function(mutation) {
        var element = mutation.target;
        element.attributeChangedCallback(mutation.attributeName, mutation.oldvalue, element.getAttribute(mutation.attributeName));
      });
  });

  var config = { attributes: true, childList: false, characterData: false };
  observer.observe(MDMenu, config);

  // Init Menu
  MDMenu.init();
}