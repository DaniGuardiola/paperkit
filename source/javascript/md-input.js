var initMDInput = function(MDInput, paperkit) {
  var inputtype = MDInput.getAttribute("type");

  if (inputtype === "text" || inputtype === "password" || inputtype === "email" || inputtype === "tel" || inputtype === "number" || inputtype === "url") {
    initMDInputText(MDInput, paperkit);
  } else if (inputtype === "select") {
    initMDInputSelect(MDInput, paperkit);
  } else if (inputtype === "checkbox") {
    initMDInputCheckbox(MDInput, paperkit);
  } else if (inputtype === "list") {
    initMDInputList(MDInput, paperkit);
  }
}
