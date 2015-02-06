var paperkit = new Paperkit(); // Instantiate Paperkit on a variable of your choice
window.addEventListener('load', function(){
	paperkit.initListener(function(){
		console.log('HEYYYYYYYYYYYYY');
		paperkit.fab.addEventListener('click', function(e){
			console.log(e.clientX,e.clientY);
		});
	});
	paperkit.init(); // Initialize Paperkit on window load
	rekt.pre();
});

function contentPage(index){
	var pager = document.getElementById('content-pager');
	var tabbar = document.getElementById('content-tabbar');
	pager.moveToPage(index);
	tabbar.moveIndicatorToTab(index);
	contentPagerAction(false, index);
}

function getRekt(e){
	transition.morph(e, false, function(){
		var bigfab = document.getElementById('md-morph');
		bigfab.style.zIndex = 4500;
	});
	rekt.get(false,function(){
		transition.morphBack();
	});
}

function tabColorChange(index){
	if(index === 0){
		paperkit.toolbar.set('color','cyan');
		paperkit.fab.set('color','cyan');
		[].forEach.call(document.querySelectorAll('.version-name'),function(span){
			span.setAttribute('md-font-color','cyan-700');
		});
	} else if(index === 1){
		paperkit.toolbar.set('color','blue');
		paperkit.fab.set('color','blue');		
		[].forEach.call(document.querySelectorAll('.version-name'),function(span){
			span.setAttribute('md-font-color','blue-700');
		});
	} else if(index === 2){
		paperkit.toolbar.set('color','teal');
		paperkit.fab.set('color','teal');
		[].forEach.call(document.querySelectorAll('.version-name'),function(span){
			span.setAttribute('md-font-color','teal-700');
		});
	} else if(index === 3){
		paperkit.toolbar.set('color','light-green');
		paperkit.fab.set('color','light-green');
		[].forEach.call(document.querySelectorAll('.version-name'),function(span){
			span.setAttribute('md-font-color','light-green-700');
		});
	} else if(index === 4){
		paperkit.toolbar.set('color','orange');
		paperkit.fab.set('color','orange');
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