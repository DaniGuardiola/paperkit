/**
 * Select input element initializer
 * @param  {element} el Element being initialized
 */
var initMDInputSelect = function(el, materializer) {
	var spanText;

	el.initElements = function() {
		var value = this.getAttribute('value');
		if (this.querySelector('option[value="' + value + '"')) {
			var valueText = this.querySelector('option[value="' + value + '"').innerText;
		}

		this.spanText = document.createElement("span");
		this.spanText.classList.add('text');
		this.spanText.innerText = valueText;
		this.appendChild(this.spanText);

		var icon = document.createElement('md-icon');
		icon.setAttribute('md-image','arrow_drop_down');
		icon.setAttribute('md-fill','grey');
		initMDIcon(icon, materializer);
		this.appendChild(icon);

		var divLine = document.createElement("div");
		divLine.classList.add("line");
		this.appendChild(divLine);
	}
	el.initElements();
}