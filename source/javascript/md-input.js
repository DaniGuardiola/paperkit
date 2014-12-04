var initMDInput = function(MDInput) {
	var spanHint;

	MDInput.initElements = function() {
		var input = document.createElement("input");
		input.id=this.id + "-input";
		input.type = this.getAttribute("type");
		input.value = this.getAttribute("value");
		input.name = this.getAttribute("name");
		this.appendChild(input);

		this.spanHint = document.createElement("span");
		this.spanHint.classList.add("hint");
		this.spanHint.innerHTML = this.getAttribute("placeholder");
		this.appendChild(this.spanHint);

		var spanError = document.createElement("span");
		spanError.classList.add("error");
		spanError.innerHTML = "Mensaje de error";
		this.appendChild(spanError);

		var divLine = document.createElement("div");
		divLine.classList.add("line");
		this.appendChild(divLine);
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

	MDInput.initElements();
}
