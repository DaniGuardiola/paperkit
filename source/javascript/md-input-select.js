/**
 * Select input element initializer
 * 
 * @param {element} el Element being initialized
 */
var initMDInputSelect = function(MDInputSelect, materializer) {
  var spanText;
  var value;
  var menu;

  /**
   * Click listener
   * 
   * @param {Event} e Listener for click events in this element
   */
  MDInputSelect.clickListener = function(e) {
    var el = e.currentTarget;
    console.log("CLICK EN INPUT SELECT");
    if (el.tagName === "MD-INPUT" && el === this) {
      if(!this.menu) {
        this.menu = document.createElement('md-menu');
        this.menu.id = this.getMenuId();
        materializer.initElement(this.menu);        
        document.body.appendChild(this.menu);
      }

      this.menu.setAttribute("md-position", "parentInputSelect");
      this.menu.clearOptions();
      
      // TODO: Should this be done allways???? 
      // It's slow as hell if there are lots of options...
      // Add options as md-tiles
      [].forEach.call(this.querySelectorAll('option'), function(option) {
        this.menu.addOption(option.getAttribute('value'), option.innerText);
      }, this);      
      
      this.value = this.getAttribute('value');
      this.menu.setSelectedValue(this.getAttribute('value'));
      this.menu.setCallback(this.menuListener.bind(this));
      this.menu.open(this);
    }

    if (event.stopPropagation) {
      event.stopPropagation(this.menuListener)
    } else {
      event.cancelBubble = true
    }
  }

  /**
   * Listener for menu selection. Callback for the menu object.
   * 
   * @param {element} tile The selected tile element.
   */
  MDInputSelect.menuListener = function(tile, menu) {
    if (tile) {
      var text = tile.querySelector('md-text').innerText;
      var value = this.value = tile.getAttribute('value');
      

      // Change selected option, text and value.
      this.spanText.innerText = text;
      this.setAttribute('value', value);

      // Change list selected option
      // TODO: Is this this element responsability? Does this element have to know list internal structure?
      menu.setSelectedValue(value);
    }

    // Close the menu.
    menu.close(true);
  }

  /**
   * Generates child menu ID
   * 
   * @return {string} the child menu ID.
   */
  MDInputSelect.getMenuId = function() {
    return this.id + "-menu";
  }

  /**
   * Initializes md-input elements
   */
  MDInputSelect.initElements = function() {
    // Add span for text
    this.spanText = document.createElement("span");
    this.spanText.classList.add('text');
    this.appendChild(this.spanText);
    
    // Add icon
    var icon = document.createElement('md-icon');
    icon.setAttribute('md-image', 'icon:arrow_drop_down');
    icon.setAttribute('md-fill', 'grey');
    initMDIcon(icon, materializer);
    this.appendChild(icon);

    var divLine = document.createElement("div");
    divLine.classList.add("line");
    this.appendChild(divLine);
    
    this.calcWidth();
    
    var value = this.getAttribute('value');
    this.setValue(value);
    this.addEventListener('click', this.clickListener.bind(this));
    
    this.input = document.createElement("input");
    this.input.id=this.id;
    this.input.type= "hidden";
    this.input.value= this.getAttribute('value') ? this.getAttribute('value') : '';
    this.input.name= this.getAttribute('name') ? this.getAttribute('name') : '';
    this.appendChild(this.input);
  }
  
  MDInputSelect.getOption= function(value) {
    var option = this.querySelector('option[value="' + value + '"]');
    return option;
  }

  /**
   * Sets the value of this select
   * @param {string} value The value to set.
   */
  MDInputSelect.setValue= function(value) {
    var option = null;
    
    if((option=this.getOption(value))) {
      this.value =this.input.value=  value;
      this.spanText.innerText = option.innerText;
    }
  }
  
  /**
   * Clears all options from this select.
   */
  MDInputSelect.clearOptions= function() {
    for(var i=this.children.length-1; i >= 0; i--) {
      var child = this.children[i];
      if(child.tagName=="OPTION") {
        this.removeChild(child);
      } 
    }
  }
  
  /**
   * Removes an option from this select.
   * @param {string} option The option to remove. 
   */
  MDInputSelect.removeOption= function(value) {
    var option = null;
    if((option= this.getOption(value))) {
      this.removeChild(option);
    }
  }
  
  /**
   * Adds an option to this select.
   * @param {string} value The value for the option.
   * @param {string} label The label for the option.
   */
  MDInputSelect.addOption= function(value, label) {
    var option = document.createElement("option");
    option.value = value;
    option.innerText = label;    
    this.appendChild(option);
    
    if(this.getAttribute('value')===value) {
      this.setValue(value);
    }
    this.calcWidth();
  }

  /**
   * Calculates width of element based on font size.
   */
  MDInputSelect.calcWidth = function() {
    var longestString = "";
    var elementStyle = window.getComputedStyle(this.querySelector('span.text'));
    [].forEach.call(this.querySelectorAll("option"), function(option) {
      longestString = option.innerText.length > longestString.length
              ? option.innerText : longestString;
    });
    this.style.width = (materializer.calcTextMetrics(longestString,
            elementStyle).width + 36)
            + "px";
  }
  
  MDInputSelect.attributeChangedCallback = function(attrname, oldvalue, newvalue) {
    console.log("CHANGED ATTRIBUTE " + attrname + " VALUE " + newvalue);
    if(attrname==="value") {
      this.setValue(newvalue);
    }
  }

  /**
   * Initialization.
   */
  MDInputSelect.initElements();
  
  // INIT OBSERVER
  var observer = new MutationObserver(function(mutations) { 
      mutations.forEach(function(mutation) {
        var element = mutation.target;
        element.attributeChangedCallback(mutation.attributeName, mutation.oldvalue, element.getAttribute(mutation.attributeName));
      });
  });

  var config = { attributes: true, childList: false, characterData: false };
  observer.observe(MDInputSelect, config);
}