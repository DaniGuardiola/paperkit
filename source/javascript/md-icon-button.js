// TODO: Review, it doesn't work with new menu...
var initMDIconButton = function(MDIconButton) {
  initMDButton(MDIconButton);

  MDIconButton.removeEventListener('click', MDIconButton.clickListener);

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
}