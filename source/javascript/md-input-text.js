var initMDInputText = function(MDInput) {
	var spanHint;
	var input;

	MDInput.initElements = function() {
		var value = this.getAttribute('value');

		this.spanHint = document.createElement("span");
		this.spanHint.innerHTML = this.getAttribute("placeholder");
		this.appendChild(this.spanHint);

		this.input = document.createElement("input");
		this.input.id=this.id + "-input";
		this.input.type = this.getAttribute("type");
		this.input.value = this.getAttribute("value");
		this.input.name = this.getAttribute("name");
		this.appendChild(this.input);

		var spanError = document.createElement("span");
		spanError.classList.add("error");
		this.appendChild(spanError);

		var divLine = document.createElement("div");
		divLine.classList.add("line");
		this.appendChild(divLine);

		// Sets initial status
		var mode= this.getAttribute("md-mode") ? this.getAttribute("md-mode") : "animated";

		if(mode==="hint") {
			this.spanHint.classList.add("hint");
		} else if(mode==="placeholder") {
			if(this.input.value && this.input.value!=="") {
				this.spanHint.style.visibility="hidden";
			}			
			this.input.addEventListener('input', MDInput.setFocus.bind(this));
		} else {
			if(this.input.value && this.input.value!=="") {
				this.spanHint.classList.add("hint");
			}
			this.input.addEventListener('focus', MDInput.setFocus.bind(this));
			this.input.addEventListener('blur', MDInput.removeFocus.bind(this));			
		}
 
	} 

	/**
	 * Sets hint or placeholder mode.
	 * @param {string} mode the mode to set, "placeholder" or "hint"
	 */
	MDInput.setHintMode = function(mode) {
		if(mode==="placeholder") {
			this.spanHint.classList.remove("hint");
		} else if(mode==="hint") {
			this.spanHint.classList.add("hint");
		}		
	}

	/* ---- EVENT LISTENERS ---- */
	/**
	 * Listener for focus entry and content change, handles focus and input event for input object
	 * moves placeholder to hint.
 	 * @param {event} e Event object @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Event}
	 */
	MDInput.setFocus = function(e) {
		if(this==MDInput) { // sanity check
			var mode= this.getAttribute("md-mode") ? this.getAttribute("md-mode") : "animated";

			if(mode==="placeholder") {
				if(this.input.value==="") {
					this.spanHint.style.visibility="visible";
				} else {
					this.spanHint.style.visibility="hidden";
				}				
			} else if(mode==="animated") {
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
		if(this==MDInput) { // sanity check
			if(this.input.value==="") {
				this.setHintMode('placeholder');
			}
		}
	}

	MDInput.initElements();
}
