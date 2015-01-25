var md = new Materializer(); // Instantiate Materializer on a variable of your choice
window.addEventListener('load', function(){
	md.init(); // Initialize Materializer on window load
});

function contentPage(index){
	var pager = document.getElementById('content-pager');
	var tabbar = document.getElementById('content-tabbar');
	pager.moveToPage(index);
	tabbar.moveIndicatorToTab(index);
	contentPagerAction(false, index);
}

function tabColorChange(index){
	if(index === 0){
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

function contentPagerAction(tab, index){
	var contentPager = document.getElementById('content-pager');
	contentPager.scrollIntoView();
	tabColorChange(index);
}

function openDiscussion(){
	contentPage(4);
}