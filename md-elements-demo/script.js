var md = new Materializer(); // Instantiate Materializer on a variable of your choice
window.addEventListener('load', function(){ md.init() }); // Initialize Materializer on window load

function toggleCollapse(target){
	var titleRow = document.getElementById('toolbar-title-row');
	var text = document.getElementById('toolbar-title-small');
	if (titleRow.style.display != 'none') {
		titleRow.style.display = 'none';
		text.style.display = '';
		target.setAttribute('md-image','icon:expand_more');
	} else {
		titleRow.style.display = '';
		text.style.display = 'none';
		target.setAttribute('md-image','icon:expand_less');
	}
}