var md = new Materializer(); // Instantiate Materializer on a variable of your choice
window.addEventListener('load', function(){
	md.init(); // Initialize Materializer on window load
	document.getElementById('next-page-tags').addEventListener('click', function(){
		quickStartPage(1);
	});
	document.getElementById('back-page-ready').addEventListener('click', function(){
		quickStartPage(0);
	});
	document.getElementById('next-page-layout').addEventListener('click', function(){
		quickStartPage(2);
	});
	document.getElementById('back-page-tags').addEventListener('click', function(){
		quickStartPage(1);
	});
	document.getElementById('next-page-scripting').addEventListener('click', function(){
		quickStartPage(3);
	});
	document.getElementById('back-page-layout').addEventListener('click', function(){
		quickStartPage(2);
	});
	document.getElementById('next-page-customization').addEventListener('click', function(){
		quickStartPage(4);
	});
	document.getElementById('back-page-scripting').addEventListener('click', function(){
		quickStartPage(3);
	});
	document.getElementById('next-page-components').addEventListener('click', function(){
		contentPage(1);
	});
});
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

function contentPage(index){
	var pager = document.getElementById('content-pager');
	var tabbar = document.getElementById('content-tabbar');
	pager.moveToPage(index);
	tabbar.moveIndicatorToTab(index);
	pager.scrollIntoView();
}

function quickStartPage(index){
	var pager = document.getElementById('quick-start-pager');
	var tabbar = document.getElementById('quick-start-tabbar');
	var contentPager = document.getElementById('content-pager');
	pager.moveToPage(index);
	tabbar.moveIndicatorToTab(index);
	contentPager.scrollIntoView();
}

function scrollTopContentPager(){
	var contentPager = document.getElementById('content-pager');
	contentPager.scrollIntoView();	
}