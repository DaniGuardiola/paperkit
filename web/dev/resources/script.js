var scrollCollapse;
function contentPage(index){
	var pager = document.getElementById('content-pager');
	var tabbar = document.getElementById('content-tabbar');
	pager.moveToPage(index);
	tabbar.moveIndicatorToTab(index);
	contentPagerAction(false, index);
}

function contentPagerAction(tab, index){
	if (index === 5) {
		paperkit.fab.hide();
	} else {
		paperkit.fab.show();
	}
}

function openDiscussion(){
	contentPage(5);
}