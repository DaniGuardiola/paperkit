var initMDInput = function(MDInput) {
	var spanHint;
	var input;

	MDInput.initElements = function() {
		var value = this.getAttribute('value');

		this.spanHint = document.createElement("span");
		this.spanHint.classList.add("hint");
		if(!value || value === "") {
			this.spanHint.classList.add("placeholder");
		}		
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

		this.input.addEventListener('focus', MDInput.setFocus.bind(this));
		this.input.addEventListener('blur', MDInput.removeFocus.bind(this));
	} 

	MDInput.setHintMode = function(mode) {
		if(mode==="placeholder") {
			this.spanHint.classList.add("placeholder");
		} else if(mode==="hint") {
			if(this.spanHint.classList.contains("placeholder")) {
				this.spanHint.classList.remove("placeholder");
			}
		}		
	}

	MDInput.setFocus = function(e) {
		if(this==MDInput) {
			this.setHintMode('hint');
			this.input.focus();
		}		
	}

	MDInput.removeFocus = function(e) {
		if(this==MDInput) {
			if(this.input.value==="") {
				this.setHintMode('placeholder');
			}
		}
	}

	MDInput.initElements();
}
