var md = new Materializer(); // Instantiate Materializer on a variable of your choice
window.addEventListener('load', function(){
	md.init(); // Initialize Materializer on window load

	// Quick start tab pagers
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

	// Components tab pagers
	document.getElementById('back-page-quickstart').addEventListener('click', function(){
		contentPage(0);
	});
	document.getElementById('next-page-demos').addEventListener('click', function(){
		contentPage(2);
	});

	// Demos tab pagers
	document.getElementById('back-page-components').addEventListener('click', function(){
		contentPage(1);
	});
	document.getElementById('next-page-tutorial').addEventListener('click', function(){
		contentPage(3);
	});

	// Tutorial tab pagers
	document.getElementById('back-page-demos').addEventListener('click', function(){
		contentPage(2);
	});
	document.getElementById('next-page-reference').addEventListener('click', function(){
		window.location.href = 'https://gitlab.datatrends.es/opensource/materializer/wikis/reference/';
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
	contentPagerAction(false, index);
}

function tabColorChange(index){
	if(index === 0){
		quickStartPage(0);
		md.toolbar.set('color','cyan');
		md.fab.set('color','cyan');
		[].forEach.call(document.querySelectorAll('.version-name'),function(span){
			span.setAttribute('md-font-color','cyan-700');
		});
	} else if(index === 1){
		md.toolbar.set('color','blue');
		md.fab.set('color','blue');		
		[].forEach.call(document.querySelectorAll('.version-name'),function(span){
			span.setAttribute('md-font-color','blue-700');
		});
	} else if(index === 2){
		md.toolbar.set('color','teal');
		md.fab.set('color','teal');
		[].forEach.call(document.querySelectorAll('.version-name'),function(span){
			span.setAttribute('md-font-color','teal-700');
		});
	} else if(index === 3){
		md.toolbar.set('color','light-green');
		md.fab.set('color','light-green');
		[].forEach.call(document.querySelectorAll('.version-name'),function(span){
			span.setAttribute('md-font-color','light-green-700');
		});
	} else if(index === 4){
		md.toolbar.set('color','orange');
		md.fab.set('color','orange');
		[].forEach.call(document.querySelectorAll('.version-name'),function(span){
			span.setAttribute('md-font-color','orange-700');
		});
	}
}

function quickStartPage(index){
	var pager = document.getElementById('quick-start-pager');
	var tabbar = document.getElementById('quick-start-tabbar');
	var contentPager = document.getElementById('content-pager');
	pager.moveToPage(index);
	tabbar.moveIndicatorToTab(index);
	contentPager.scrollIntoView();
}

function contentPagerAction(tab, index){
	var contentPager = document.getElementById('content-pager');
	contentPager.scrollIntoView();
	tabColorChange(index);
}

function openDiscussion(){
	contentPage(4);
}