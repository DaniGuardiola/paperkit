// TODO: Review, it doesn't work with new menu...
var initMDIconButton = function(MDIconButton, paperkit) {
  //  Herencia no funciona como planeado...
  //  TODO: Buscar otra forma de hacerlo, esto da muchos problemas de reescritura de objetos y funciones
  //  initMDButton(MDIconButton);
  //  MDIconButton.removeEventListener('click', MDIconButton.clickListener);
  //  this.observer.disconnect();

  MDIconButton.attributeChangedCallback = function(attrname, oldvalue, newvalue) {
    console.log("CHANGED ATTRIBUTE IN MD-ICON-BUTTON " + attrname + " VALUE " + newvalue);
    if (this.tagName === 'MD-ICON-BUTTON') { // Sanity Check
      if (attrname === 'md-image' || attrname === 'md-type' || attrname === 'md-size' || attrname === 'md-transition') {
        this.updateIcon();
      }
    }
  };

  MDIconButton.updateIcon = function() {
    var image = this.getAttribute('md-image') ? this.getAttribute('md-image') : '';
    var type = this.getAttribute('md-type') ? this.getAttribute('md-type') : 'icon';
    var size = this.getAttribute('md-size') ? this.getAttribute('md-size') : '';
    var transition = this.getAttribute('md-transition') ? this.getAttribute('md-transition') : '';

    var iconElement = this.querySelector('md-icon');
    if (!iconElement) {
      iconElement = document.createElement('md-icon');
      paperkit.initElement(iconElement);
      this.appendChild(iconElement);
    }

    iconElement.setAttribute('md-type', type);
    iconElement.setAttribute('md-image', image);
    iconElement.setAttribute('md-size', size);
    iconElement.setAttribute('md-transition', transition);
  }


  MDIconButton.clickListener = function(e) {
    var el = e.currentTarget;
    var action = el.getAttribute("md-action") ? el.getAttribute('md-action') : 'submit';

    switch (action) {
      case 'chrome-app-close':
        chrome.app.window.current().close();
        break;
      default:
        if (action.indexOf('custom:') != -1) {
          var f = action.substring(action.indexOf('custom:') + 'custom:'.length).trim();
          el.callUserFunction(f, [el, e]);
        } else if (action.indexOf('link:') != -1) {
          var f = action.substring(action.indexOf('link:') + 'link:'.length).trim();
          window.open(f, '_self');
        } else if (action.indexOf('link-out:') != -1) {
          var f = action.substring(action.indexOf('link-out:') + 'link-out:'.length).trim();
          window.open(f);
        } else if (action.indexOf('menu:') != -1) {
          var f = action.substring(action.indexOf('menu:') + 'menu:'.length).trim();
          el.openMenu(f);
        }
        break;
    }
  };

  MDIconButton.openMenu = function(menuName, el) {
    var menu = document.getElementById(menuName);

    if (menu) {
      if (menu.status == "closed") {
        menu.setAttribute("md-position", "parentIcon");
        menu.setCallback(this.menuListener);
        menu.open(this);

      }
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

  // Initialization
  MDIconButton.updateIcon();
  MDIconButton.addEventListener('click', MDIconButton.clickListener);

  //INIT OBSERVER
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      var element = mutation.target;
      element.attributeChangedCallback(mutation.attributeName, mutation.oldvalue, element.getAttribute(mutation.attributeName));
    });
  });

  var config = {
    attributes: true,
    childList: false,
    characterData: false
  };
  observer.observe(MDIconButton, config);
}
