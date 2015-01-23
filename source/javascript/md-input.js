var initMDInput = function(MDInput, materializer) {
	var inputtype=MDInput.getAttribute("type");

	if(inputtype==="text" || inputtype==="password" || inputtype==="email" || inputtype==="tel" || inputtype==="number" || inputtype==="url") {
		initMDInputText(MDInput, materializer);
	} else if(inputtype==="select") {
		initMDInputSelect(MDInput, materializer);
	} else if(inputtype==="checkbox") {
		initMDInputCheckbox(MDInput, materializer);
	} else if(inputtype==="list") {
	  initMDInputList(MDInput, materializer);
	}
}