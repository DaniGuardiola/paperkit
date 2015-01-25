/**
 * Action initializer draft
 * @param  {element} el  Element being initialized
 * @param  {object} opt Options
 * @return {boolean}     True on success, false on error
 */
// Paperkit.prototype.init.action = function(el, opt) {

//   /**
//    * Action listener, has multiple predetermined actions and a custom one
//    * @param  {event} e Event fired that contains the element with md-action
//    */
//   el.actionListener = function(e) {
//     var el = e.currentTarget;
//     var action = el.getAttribute("md-action") ? el.getAttribute('md-action') : 'submit';

//     switch(action) {
//       case 'submit': 
//         submitForm(el);
//         break;
//       case 'reset':
//         resetForm(el);
//         break;
//       case 'snackbar-dismiss':
//         snackbarDismiss(el);
//         break;
//       case 'morph':
//         transition.morph(el);
//         break;
//       case 'chrome-app-close':
//         chrome.app.window.current().close();
//         break;
//       default:
//         if(action.indexOf('custom:') != -1) {
//           var f = action.substring(action.indexOf('custom:') + 'custom:'.length).trim();
//           this.callFunction(f, el);
//         } else if (action = "chrome-app-close") {
//           chrome.app.window.current().close();
//         }
//         break;
//     }
//   };

//   var submitForm= function(target) {
//     console.log("submit from clicked!");
//     var form = findParentForm(target);
//     if(form) {
//       form.submit();
//     }    
//   }

//   var resetForm= function(target) {
//     console.log("reset form clicked!");
//     var form = findParentForm(target);
//     if(form) {
//       form.submit();  
//     }    
//   }

//   var snackbarDismiss= function(target) {
//     console.log("snackbar dismiss clicked!")
//   }

//   el.callFunction= function(f, target) {
//     console.log("calling function " + f);
//     executeFunctionByName(f, window, [ target ]);
//   }

//   var findParentForm= function(element) {
//     var el = element.parentNode;

//     do {
//       if(el.tagName=="FORM") {
//         return el;
//       } else if(el.tagName=="BODY") {
//         return null;
//       }
//     } while((el = el.parentNode) != null);
//     return null;
//   }

//   // Initialize listener and parent form keypress listener
//   el.addEventListener('click', el.clickListener);

//   // If not md-action then submit is the default, set form key listener
//   if(!el.getAttribute('md-action')) {
//       var parentForm = findParentForm(el);
//       if(parentForm) {
//         parentForm.addEventListener('keypress', el.enterKeyListener);
//       }    
//   }

//   // SET INITIAL PROPERTIES
//   if(el.getAttribute('md-action')) {
//     el.attributeChangedCallback('md-action', '', el.getAttribute('md-action'));
//   }

//   // INIT OBSERVER
//   var observer = new MutationObserver(function(mutations) { 
//       mutations.forEach(function(mutation) {
//         var element = mutation.target;
//         element.attributeChangedCallback(mutation.attributeName, mutation.oldvalue, element.getAttribute(mutation.attributeName));
//       });
//   });

//   var config = { attributes: true, childList: false, characterData: false };
//   observer.observe(el, config);

// }