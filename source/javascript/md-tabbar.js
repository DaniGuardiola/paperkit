/**
 * MDTabBar Object.
 * Object code that extends HTML Element to support
 * md-tabbar element functionality.
 */
var initMDTabBar = function(MDTabBar) {
  /* Width of tabs for fixed and fullscreen modes */
  MDTabBar.tabWidth = 0;
  /* Array of tabs */
  MDTabBar.tabs = [];
  /* Selector object */
  MDTabBar.selector = null;

  /**
   * Handles a click on a tab inside this tabbar.
   * If tabbar has a 'md-action: custom' property it calls the user specified function.
   * If tabbar has a 'md-pager' property it calls the movePage method of the specified pager.
   * Both calls are compatible, and both can happen.
   * It moves tabbar indicator to selected tab too.
   *
   * @param {event} e Event object @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Event}
   */
  MDTabBar.clickHandler = function(e) {
    var el = e.currentTarget;
    var parentTabBar = el.parentNode;

    if (el.tagName === "MD-TAB" && parentTabBar === this) {
      /* First it handles custom action */
      var action = this.getAttribute("md-action") ? this.getAttribute('md-action') : 'none';
      if (action === 'none') {
        /* Nothing to do */
      } else {
        if (action.indexOf('custom:') != -1) {
          var f = action.substring(action.indexOf('custom:') + 'custom:'.length).trim();
          this.callUserFunction(f, [el, el.index]);
        }
      }

      /* Then it handles md-pager */
      var pagerID = this.getAttribute("md-pager") ? this.getAttribute("md-pager") : null;
      if (pagerID) {
        var pager = document.getElementById(pagerID);
        if (pager && pager.tagName === "MD-PAGER") {
          pager.moveToPage(el.index);
        }
      }

      /* Finally moves indicator */
      this.moveIndicatorToTab(el.index);
    }
  };

  /**
   * Moves indicator to selected tab.
   * @param  {integer} tabNumber Index of tab to move indicator to.
   */
  MDTabBar.moveIndicatorToTab = function(tabNumber) {
    var tabBarRect = this.getBoundingClientRect();
    var tabWidth = tabBarRect.width / this.tabs.length;
    var newLeft = tabNumber * tabWidth;
    var newRight = (((this.tabs.length - tabNumber - 1) * tabWidth));

    if (parseInt(this.selector.style.left) < newLeft) {
      this.selector.style.transition = "right 0.25s ease-out, left 0.25s ease-out 0.12s";
    } else {
      this.selector.style.transition = "left 0.25s ease-out, right 0.25s ease-out 0.12s";
    }

    this.selector.style.left = newLeft + "px";
    this.selector.style.right = newRight + "px";
  }

  /**
   * Inits tabs array, loading each child
   * tab into it. Inits tabs.index and tabbar.width.
   */
  MDTabBar.initTabBar = function() {
    var tabs = MDTabBar.getElementsByTagName("md-tab");

    for (var i = 0; i < tabs.length; i++) {
      var tab = tabs[i];
      this.tabs.push(tab);
      this.tabWidth = this.tabWidth < tab.getBoundingClientRect().width ? tab.getBoundingClientRect().width : this.tabWidth;
    }

    this.style.width = (!this.getAttribute("md-type") || this.getAttribute("md-type") === "fixed") ?
      this.tabWidth * this.tabs.length + "px" : "100%";

    this.tabs.forEach(function(tab, index) {
      if (!this.getAttribute("md-type") || this.getAttribute("md-type") === "fixed") {
        tab.style.flex = "0 0 " + this.tabWidth + "px";
      } else if (this.getAttribute("md-type") === "fulscreen") {
        tab.style.flex = "1 0 auto";
      }
      tab.index = index;
      tab.addEventListener('click', MDTabBar.clickHandler.bind(this));
    }, this);
  }

  /**
   * Injects selector div as last child of md-tabbar.
   */
  MDTabBar.injectSelector = function() {
    if (!this.selector) {
      this.selector = document.createElement('div');
      this.selector.id = "selector";
      if (this.getAttribute('md-selector-color')) {
        this.selector.style.backgroundColor = this.getAttribute('md-selector-color');
      }
      this.appendChild(this.selector);
    }
  }

  /**
   * Callback that handles changing values of attributes.
   * @param  {string} attrname Attribute name.
   * @param  {string} oldvalue Old value of attribute.
   * @param  {string} newvalue New value of attribute.
   */
  MDTabBar.attributeChangedCallback = function(attrname, oldvalue, newvalue) {
    console.log("CHANGED ATTRIBUTE " + attrname + " VALUE " + newvalue);
  };

  // Initializes tabs.
  MDTabBar.initTabBar();
  MDTabBar.injectSelector();
  MDTabBar.moveIndicatorToTab(0);

  // Initializes attribute change observer.
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
  observer.observe(MDTabBar, config);
}
