state = {
    data: {
    },
    // Functions
    start: {
        index: function() {
            md.toolbar.set('color','cyan');
            md.toolbar.set('height','x1');
        }
    },
    ref: {
        index: function() {
        },
        tag: {
            index: function(){
                md.toolbar.querySelector('md-text').innerHTML = "Tags";
                state.ref.tag.generic();
                md.justInCase('reload');
            },
            generic: function(){
                md.toolbar.set('color','orange');
                md.toolbar.set('height','x1');
                state.ref.tag.menu();
            },
            menu: function(){
                md.sidemenu.innerHTML = '<img id="logo" src="logo.png"><md-list md-action="ajax: md-content"><md-tile md-ajax="page/ref/tag/toolbar.html" md-ajax-callback="state.ref.tag.toolbar"><md-text>Toolbar</md-text></md-tile><md-tile md-ajax="page/ref/tag/toolbar.html" md-ajax-callback="state.ref.tag.toolbar"><md-text>toolbar</md-text></md-tile><md-tile md-ajax="page/ref/tag/toolbar.html" md-ajax-callback="state.ref.tag.toolbar"><md-text>toolbar</md-text></md-tile><md-tile md-ajax="page/ref/tag/toolbar.html" md-ajax-callback="state.ref.tag.toolbar"><md-text>toolbar</md-text></md-tile><md-tile md-ajax="page/ref/tag/toolbar.html" md-ajax-callback="state.ref.tag.toolbar"><md-text>toolbar</md-text></md-tile><md-tile md-ajax="page/ref/tag/toolbar.html" md-ajax-callback="state.ref.tag.toolbar"><md-text>toolbar</md-text></md-tile><md-tile md-ajax="page/ref/tag/toolbar.html" md-ajax-callback="state.ref.tag.toolbar"><md-text>toolbar</md-text></md-tile></md-list>';
            },
            // TAGS
            toolbar: function(){
                console.log('HOLAP');
                md.toolbar.querySelector('md-text').innerText = "<md-toolbar>";                
            }
        },
        attr: {
            index: function(){}
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