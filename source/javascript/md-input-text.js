var initMDInputText = function(MDInput) {
  var spanHint;
  var spanError;
  var input;
  var value;

  MDInput.initElements = function() {
    var value = this.getAttribute('value');

    this.spanHint = document.createElement("span");
    this.spanHint.id = "placeholder";
    this.spanHint.classList.add("placeholder");
    this.spanHint.innerHTML = this.getAttribute("placeholder") ? this.getAttribute("placeholder") : "";
    this.appendChild(this.spanHint);

    this.spanError = document.createElement("span");
    this.spanError.classList.add("error");
    this.spanError.innerHTML = this.getAttribute("md-error") ? this.getAttribute("md-error") : "";
    this.appendChild(this.spanError);

    var divLine = document.createElement("div");
    divLine.classList.add("line");
    this.appendChild(divLine);

    this.input = document.createElement("input");
    this.input.id = this.id + "-input";
    this.input.type = this.getAttribute("type");
    this.value = this.input.value = this.getAttribute("value") ? this.getAttribute("value") : "";
    this.input.name = this.getAttribute("name");
    this.appendChild(this.input);


    // Sets initial status
    var mode = this.getAttribute("md-mode") ? this.getAttribute("md-mode") : "animated";

    if (mode === "hint") {
      this.spanHint.classList.add("hint");
    } else if (mode === "placeholder") {
      if (this.input.value && this.input.value !== "") {
        this.spanHint.style.visibility = "hidden";
      }
      this.input.addEventListener('input', MDInput.setFocus.bind(this));
    } else {
      if (this.input.value && this.input.value !== "") {
        this.spanHint.classList.add("hint");
      }
      this.input.addEventListener('focus', MDInput.setFocus.bind(this));
      this.input.addEventListener('blur', MDInput.removeFocus.bind(this));
    }

    this.input.addEventListener('change', MDInput.changeValue.bind(this));
  }

  /**
   * Sets hint or placeholder mode.
   * @param {string} mode the mode to set, "placeholder" or "hint"
   */
  MDInput.setHintMode = function(mode) {
    if (mode === "placeholder") {
      this.spanHint.classList.remove("hint");
    } else if (mode === "hint") {
      this.spanHint.classList.add("hint");
    }
  }

  /* ---- EVENT LISTENERS ---- */

  /**
   * Listener for value change in input element.
   * Sets md-input value to element value.
   * @param {event} e Event object @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Event}
   */
  MDInput.changeValue = function(e) {
    if (this === MDInput) { // Sanity check.
      var el = e.currentTarget;
      this.value = el.value;
      this.setAttribute("value", this.value);
    }
  }

  /**
   * Listener for focus entry and content change, handles focus and input event for input object
   * moves placeholder to hint.
   * @param {event} e Event object @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Event}
   */
  MDInput.setFocus = function(e) {
    if (this == MDInput) { // sanity check
      var mode = this.getAttribute("md-mode") ? this.getAttribute("md-mode") : "animated";

      if (mode === "placeholder") {
        if (this.input.value === "") {
          this.spanHint.style.visibility = "visible";
        } else {
          this.spanHint.style.visibility = "hidden";
        }
      } else if (mode === "animated") {
        this.setHintMode('hint');
      }

      // this.input.focus();
    }
  }

  /**
   * Listener for focus exit, handles blur event for input object
   * moves hint to placeholder if there is content.
   * @param {event} e Event object @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Event}
   */
  MDInput.removeFocus = function(e) {
    if (this == MDInput) { // sanity check
      if (this.input.value === "") {
        this.setHintMode('placeholder');
      }
    }
  }

  /**
   * Attribute change listener.
   * Actually only checks for changes in the placeholder.
   *
   * @param  {string} attrname Name of the changed attribute.
   * @param  {string} oldvalue Old value of the attribute, or null if no old value.
   * @param  {string} newvalue New value of the attribute.
   */
  MDInput.attributeChangedCallback = function(attrname, oldvalue, newvalue) {
    console.log("CHANGED ATTRIBUTE " + attrname + " VALUE " + newvalue);
    if (attrname === "placeholder") {
      this.spanHint.innerHTML = newvalue;
    } else if (attrname === "value") {
      this.value = this.input.value = newvalue;
      this.setFocus();
    } else if (attrname === "name") {
      this.input.name = newvalue;
    } else if (attrname === "id") {
      this.input.id = newvalue + "-input"
    } else if (attrname === "md-error") {
      this.spanError.innerHTML = newvalue;
    }
  };

  /* ---- OBJECT INITIALIZATION ---- */
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
  observer.observe(MDInput, config);

  MDInput.initElements();
}
