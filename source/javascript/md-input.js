var initMDInput = function(MDInput) {
	var inputtype=MDInput.getAttribute("type");

	if(inputtype==="text" || inputtype==="password" || inputtype==="email" || inputtype==="tel" || inputtype==="number" || inputtype==="url") {
		initMDInputText(MDInput);
	} else if(inputtype==="select") {

	} 
}