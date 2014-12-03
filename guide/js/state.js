state = {
    data: {
    },
    // Functions
    start: {
        index: function() {
            md.toolbar.set('color','cyan');
            md.toolbar.set('height','x1')
        }
    },
    plan: {
        index: function() {
            md.toolbar.set('color','blue');
            md.toolbar.querySelector('md-text').innerHTML = "Plan";
            md.fab.show();
            md.fab.set('color','purple');
            md.fab.set('image','add');
            setTimeout(md.sidemenu.close,200);
        }
    },
    history: {
        index: function() {
            md.toolbar.set('color','green');
            md.toolbar.querySelector('md-text').innerHTML = "History";
            md.fab.hide();
            setTimeout(md.sidemenu.close,200);
        }
    }
};