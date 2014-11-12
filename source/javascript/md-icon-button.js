var initMDIconButton = function(MDIconButton) {
  initMDButton(MDIconButton);

  MDIconButton.removeEventListener('click', MDIconButton.clickListener);

  MDIconButton.clickListener = function(e) {
    var el = e.currentTarget;
    var action = el.getAttribute("md-action") ? el.getAttribute('md-action') : 'submit';

    switch(action) {
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
    if(menu && menu.open) {
      menu.open(el);

      document.addEventListener('click', closeListener);
    }
  }

  function closeListener(e) {
    var action=MDIconButton.getAttribute("md-action");
    var menuName = action.substring(action.indexOf('menu:') + 'menu:'.length).trim();
    var menu=document.getElementById(menuName);
    menu.close();

    document.removeEventListener('click', closeListener);
  }

  MDIconButton.addEventListener('click', MDIconButton.clickListener);
}