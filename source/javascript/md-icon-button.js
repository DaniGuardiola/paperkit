// TODO: Review, it doesn't work with new menu...
var initMDIconButton = function(MDIconButton, materializer) {
  initMDButton(MDIconButton);
  
  MDIconButton.attributeChangedCallback = function(attrname, oldvalue, newvalue) {
    console.log("CHANGED ATTRIBUTE " + attrname + " VALUE " + newvalue);
    if(this.tagName==='MD-ICON-BUTTON') {
      if(attrname==='md-image') {
        this.updateIcon(newvalue);
      }
      if(attrname==='md-avatar') {
    	this.setInnerElement();
      }
    }
  };
  
  MDIconButton.removeEventListener('click', MDIconButton.clickListener);
  
  MDIconButton.addInnerElement = function(avatar) {
	  this.icon = avatar ? document.createElement('md-avatar') : this.icon = document.createElement('md-icon');
	  this.appendChild(this.icon);
	  this.updateIcon(this.getAttribute('md-image'));
	  materializer.initElement(this.icon);
  }
  
  MDIconButton.updateIcon = function(image) {
	  if (!image) {
		  var image = '';
	  }
	  this.icon.setAttribute('md-image', image);
  }
  
  MDIconButton.setInnerElement = function() {
	  console.log('setInnerElement');
	  var avatar = false; // If not avatar
	  if (this.hasAttribute('md-avatar')) {
		  // If avatar
		  avatar = true;
	  }
	  if (this.innerHTML === '') {
		  // If empty		  
		  this.addInnerElement(avatar);
	  } else {
		  if (avatar && this.querySelector('md-avatar')) {
			  this.icon = this.querySelector('md-avatar');
		  } else if (!avatar && this.querySelector('md-icon')) {
			  this.icon = this.querySelector('md-icon');
		  } else {
			  this.innerHTML = '';
			  this.addInnerElement(avatar);
		  }
	  }
  }
  
  MDIconButton.setInnerElement();
  
  MDIconButton.clickListener = function(e) {
    var el = e.currentTarget;
    var action = el.getAttribute("md-action") ? el.getAttribute('md-action') : 'submit';

    switch(action) {
      case 'chrome-app-close':
        chrome.app.window.current().close();
        break;
      default:
        if(action.indexOf('custom:') != -1) {
          var f = action.substring(action.indexOf('custom:') + 'custom:'.length).trim();
          el.callFunction(f, el);
        } else if(action.indexOf('menu:') != -1) {
          var f = action.substring(action.indexOf('menu:') + 'menu:'.length).trim();
          el.openMenu(f);
        }
        break;
    }   
  };

  MDIconButton.openMenu= function(menuName, el) {
    var menu=document.getElementById(menuName);
    
    if(menu) {
      if(menu.status=="closed") {
        menu.setAttribute("md-position", "parentIcon");
        menu.setCallback(this.menuListener);
        menu.open(this);
        
      }
    }
    
    if (event.stopPropagation) {
      event.stopPropagation()
    } else {
      event.cancelBubble = true
    }
  }

  /**
   * Listener for menu selection. Callback for the menu object.
   * 
   * @param {element} tile The selected tile element.
   */
  MDIconButton.menuListener = function(tile, menu) {
    // Close the menu.
    menu.close(true);
  }

  MDIconButton.addEventListener('click', MDIconButton.clickListener);
    
  //INIT OBSERVER
  var observer = new MutationObserver(function(mutations) { 
      mutations.forEach(function(mutation) {
        var element = mutation.target;
        element.attributeChangedCallback(mutation.attributeName, mutation.oldvalue, element.getAttribute(mutation.attributeName));
      });
  });

  var config = { attributes: true, childList: false, characterData: false };
  observer.observe(MDIconButton, config);
}