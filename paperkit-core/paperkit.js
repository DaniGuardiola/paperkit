!function(){"use strict";function a(){c()}function b(a,b){if(b=b||!1,!a||"object"!=typeof a||a.length<1)return void m.log("[include] Invalid or empty options object","error");if(!a.type)return void m.log("[include] Block type not specified","error");"module"===a.type?m.log("I was gonna include a module"):"component"===a.type?m.log("I was gonna include a component"):"attribute"===a.type?m.log("I was gonna include an attribute"):m.log('[include] Invalid block type "'+a.type+'"',"error")}function c(){var a=document.querySelectorAll("md-include");if(a.length<1)return void m.log("[core] No <md-include> tags were found","info");for(var b=0;b<a.length;b++)d(a[b])}function d(a){var c=a.getAttribute("src");return a.hasAttribute("src")&&""!==c?void(-1!==c.indexOf(".js")?e(a):-1!==c.indexOf(".css")&&b({type:"attribute",name:"todo: get name somehow",src:c})):void m.log("[include] Src tag empty or not set in md-include tag","error")}function e(a){var b=document.createElement("script");b.src=a.getAttribute("src"),s.push(b),document.body.appendChild(b),b.addEventListener("load",function(){k(b,g)}),document.body.removeChild(b)}function f(a,b){var c=p.indexOf(a)>-1;return c?b?m[a]._mdOptions_:!0:!1}function g(a,b){if(b=b||!1,a){if("object"!=typeof a||"object"!=typeof a.options||"function"!=typeof a["function"])return m.log("[module] Not valid module object","error"),!1;var c=a.options.name,d=a["function"](),e=a.options.core?"core:":"";a.options.dependencies=a.options.dependencies||[],Object.defineProperty(d,"_mdOptions_",{get:function(){return Object.create(a.options)}}),Object.defineProperty(m,c,{value:d}),p.push(c),m.module("log")&&m.log("["+e+"module] LOAD "+c,"info"),b&&g()}else{var f=q[0];f&&"function"==typeof f["function"]?(q.splice(0,1),g(f,!0)):i()}}function h(a){return r.indexOf(a)>-1}function i(){m.log("[module] LOAD COMPLETE","info"),loadStatus.module=!0;var a=new Event("md-module-load");window.dispatchEvent(a),loadStatus.core&&loadStatus.component&&j()}function j(){m.log("[paperkit] LOAD COMPLETE","info"),loadStatus.paperkit=!0;var a=new Event("md-load");window.dispatchEvent(a)}function k(a,b){var c=s.indexOf(a);s.splice(c,1),s.length<1&&t&&b&&b()}if(void 0===window)return void console.error("PK [core] Window is undefined. What are you doing? This is the weirdest thing that ever happened to a web framework! D: I'm scared");var l=document.currentScript||document.querySelector('script[src$="paperkit.js"]')||document.querySelector("script[paperkit]")||!1;if(!l)return void console.error('PK [core] Please add "paperkit" attribute to the Paperkit script tag, or use "paperkit.js" as filename');l.addEventListener("load",function(){setTimeout(a,0)});{var m={},n=["log"],o=(n.slice(),[]);o.slice()}Object.defineProperty(m,"_loadTimestamp_",{value:Date.now()});var p=[],q=[];Object.defineProperty(f,"list",{get:function(){return p}});var r=[];Object.defineProperty(h,"list",{get:function(){return r},set:function(a){r.push(a)}});var s=[],t=!1;Object.defineProperties(m,{include:{value:b},module:{value:f},component:{value:h}}),Object.defineProperty(window,"md",{value:m}),m.log=function(a,b){return b=b||"log",a?(console[b]||(b="log"),void console[b]("PK "+a)):(m.log("PK [log] No message specified"),!1)}}(),md.include({type:"module",name:"log",core:!0},function(){"use strict";function a(a){return a?"timestamp"===a?(c.timestamp=!0,void d("[log.enable] Timestamp enabled","info")):c.types[a]?(c.types[a].on=!0,void d('[log.enable] Level "'+a+'" was enabled',"info")):void d('[log.enable] Level "'+a+'" does not exists',"error"):void d("[log.enable] No level was specified","error")}function b(a){return a?"timestamp"===a?(c.timestamp=!1,void d("[log.disable] Timestamp disabled","info")):c.types[a]?(c.types[a].on=!1,void d('[log.disable] Level "'+a+'" was disabled',"info")):void d('[log.disable] Level "'+a+'" does not exists',"error"):void d("[log.disable] No level was specified","error")}var c={banner:"PK",style:"font-family: Roboto, Arial; font-size: 13px; font-weight: 600;",timestamp:!1,types:{"default":"log",log:{color:"#000",mode:"log",on:!0},debug:{color:"#000",mode:"debug",on:!1,banner:"PK[debug] "},error:{color:"#F44336",mode:"error",on:!0},warn:{color:"#F57F17",mode:"warn",on:!0},info:{color:"#0D47A1",mode:"info",on:!1},dir:{mode:"dir"}}},d=function(a,b,e){b=b||"log",e=e||{};var f=c.timestamp?" ["+(Date.now()-md._loadTimestamp_)+"ms]":"";if(!a)return void d('[log] The "message" parameter is required',"error");if("string"!=typeof a&&"dir"!==b)return void d('[log] The "message" parameter must be string, it is '+typeof what+" instead","error");if(c.types[b]||(d('[log] Type "'+b+'" not found, switching to "'+c.types["default"]+'"',"warn"),b=c.types["default"]),c.types[b].on){var g=c.types[b],h=e.banner||g.banner||c.banner,i=e.color||g.color||c.color,j=e.style||g.style||c.style,k=e.mode||g.mode||c.mode;if(console[k]||(d('[log] Mode "'+k+'" not available on console object, switching to "log"',"warn"),k="log"),"dir"===k)return void console.dir(a+f);"error"===k&&window.printStackTrace&&console.log(window.printStackTrace()),console[k]("%c"+h+" "+a+f,"color: "+i+"; "+j)}};return Object.defineProperties(d,{options:{get:function(){return Object.create(c)}},enable:{value:a},disable:{value:b}}),a("info"),a("timestamp"),a("debug"),a("dir"),d});