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
          el.openMenu(f, el);
        }
        break;
    }   
  };

  MDIconButton.openMenu= function(menuName, el) {
    var menu=document.getElementById(menuName);
    if(menu) {
      if(menu.status=="closed") {
        menu.open(el);
        
        document.addEventListener('click', closeListener);
        if (event.stopPropagation) {
          event.stopPropagation()
        } else {
          event.cancelBubble = true
        }
      } else {
        menu.close();
        document.removeEventListener('click', closeListener);
      }
    }
  }

  function closeListener(e) {
    var action=MDIconButton.getAttribute("md-action");
    var menuName = action.substring(action.indexOf('menu:') + 'menu:'.length).trim();
    var menu=document.getElementById(menuName);
    menu.close();

    /*
    * This event goes down-up, once it reaches the target tile there is no need to
    * go down, let's cancel event bubbling. It acts "almost" like a background modal layer
    */
    if(e.stopPropagation) {
      e.stopPropagation();
    } else {
      e.cancelBubble=true;
    }    

    document.removeEventListener('click', closeListener);
  }

  MDIconButton.addEventListener('click', MDIconButton.clickListener);
}