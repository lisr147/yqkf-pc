(self.webpackChunkRemoteClient=self.webpackChunkRemoteClient||[]).push([[2424],{72424:(t,n,e)=>{"use strict";e.r(n),e.d(n,{l:()=>a});var r,i,o,s={exports:{}};r=s,i=(i="undefined"!=typeof document&&document.currentScript?document.currentScript.src:void 0)||"/index.js",o=function(t){var n,r;(t=void 0!==(t=t||{})?t:{}).ready=new Promise((function(t,e){n=t,r=e}));var o,s={};for(o in t)t.hasOwnProperty(o)&&(s[o]=t[o]);var u,a,c,f,l,p="object"==typeof window,h="function"==typeof importScripts,d="";"object"==typeof process&&"object"==typeof process.versions&&"string"==typeof process.versions.node?(d=h?e(5017).dirname(d)+"/":"//",u=function(t,n){return f||(f=e(7002)),l||(l=e(5017)),t=l.normalize(t),f.readFileSync(t,n?null:"utf8")},c=function(t){var n=u(t,!0);return n.buffer||(n=new Uint8Array(n)),n.buffer||O("Assertion failed: "+void 0),n},a=function(t,n,r){f||(f=e(7002)),l||(l=e(5017)),t=l.normalize(t),f.readFile(t,(function(t,e){t?r(t):n(e.buffer)}))},process.argv.length>1&&process.argv[1].replace(/\\/g,"/"),process.argv.slice(2),process.on("uncaughtException",(function(t){if(!(t instanceof G))throw t})),process.on("unhandledRejection",O),t.inspect=function(){return"[Emscripten Module object]"}):(p||h)&&(h?d=self.location.href:"undefined"!=typeof document&&document.currentScript&&(d=document.currentScript.src),i&&(d=i),d=0!==d.indexOf("blob:")?d.substr(0,d.lastIndexOf("/")+1):"",u=function(t){var n=new XMLHttpRequest;return n.open("GET",t,!1),n.send(null),n.responseText},h&&(c=function(t){var n=new XMLHttpRequest;return n.open("GET",t,!1),n.responseType="arraybuffer",n.send(null),new Uint8Array(n.response)}),a=function(t,n,e){var r=new XMLHttpRequest;r.open("GET",t,!0),r.responseType="arraybuffer",r.onload=function(){200==r.status||0==r.status&&r.response?n(r.response):e()},r.onerror=e,r.send(null)}),t.print||console.log.bind(console);var m,y,g=t.printErr||console.warn.bind(console);for(o in s)s.hasOwnProperty(o)&&(t[o]=s[o]);s=null,t.arguments,t.thisProgram,t.quit,t.wasmBinary&&(m=t.wasmBinary),t.noExitRuntime,"object"!=typeof WebAssembly&&O("no native wasm support detected");var w,_,b,v,A,R=!1,E="undefined"!=typeof TextDecoder?new TextDecoder("utf8"):void 0;function I(t,n){return t?function(t,n,e){for(var r=n+e,i=n;t[i]&&!(i>=r);)++i;if(i-n>16&&t.subarray&&E)return E.decode(t.subarray(n,i));for(var o="";n<i;){var s=t[n++];if(128&s){var u=63&t[n++];if(192!=(224&s)){var a=63&t[n++];if((s=224==(240&s)?(15&s)<<12|u<<6|a:(7&s)<<18|u<<12|a<<6|63&t[n++])<65536)o+=String.fromCharCode(s);else{var c=s-65536;o+=String.fromCharCode(55296|c>>10,56320|1023&c)}}else o+=String.fromCharCode((31&s)<<6|u)}else o+=String.fromCharCode(s)}return o}(b,t,n):""}function S(n){w=n,t.HEAP8=_=new Int8Array(n),t.HEAP16=new Int16Array(n),t.HEAP32=v=new Int32Array(n),t.HEAPU8=b=new Uint8Array(n),t.HEAPU16=new Uint16Array(n),t.HEAPU32=new Uint32Array(n),t.HEAPF32=new Float32Array(n),t.HEAPF64=new Float64Array(n)}t.INITIAL_MEMORY;var P,x,j=[],C=[],T=[],D=0,H=null;function O(n){t.onAbort&&t.onAbort(n),g(n+=""),R=!0,n="abort("+n+"). Build with -s ASSERTIONS=1 for more info.";var e=new WebAssembly.RuntimeError(n);throw r(e),e}function W(t){return t.startsWith("data:application/octet-stream;base64,")}function k(t){return t.startsWith("file://")}function M(t){try{if(t==P&&m)return new Uint8Array(m);if(c)return c(t);throw"both async and sync fetching of the wasm failed"}catch(t){O(t)}}function U(n){for(;n.length>0;){var e=n.shift();if("function"!=typeof e){var r=e.func;"number"==typeof r?void 0===e.arg?A.get(r)():A.get(r)(e.arg):r(void 0===e.arg?null:e.arg)}else e(t)}}function F(t){this.excPtr=t,this.ptr=t-16,this.set_type=function(t){v[this.ptr+4>>2]=t},this.get_type=function(){return v[this.ptr+4>>2]},this.set_destructor=function(t){v[this.ptr+8>>2]=t},this.get_destructor=function(){return v[this.ptr+8>>2]},this.set_refcount=function(t){v[this.ptr>>2]=t},this.set_caught=function(t){t=t?1:0,_[this.ptr+12>>0]=t},this.get_caught=function(){return 0!=_[this.ptr+12>>0]},this.set_rethrown=function(t){t=t?1:0,_[this.ptr+13>>0]=t},this.get_rethrown=function(){return 0!=_[this.ptr+13>>0]},this.init=function(t,n){this.set_type(t),this.set_destructor(n),this.set_refcount(0),this.set_caught(!1),this.set_rethrown(!1)},this.add_ref=function(){var t=v[this.ptr>>2];v[this.ptr>>2]=t+1},this.release_ref=function(){var t=v[this.ptr>>2];return v[this.ptr>>2]=t-1,1===t}}function B(t){try{return y.grow(t-w.byteLength+65535>>>16),S(y.buffer),1}catch(t){}}t.preloadedImages={},t.preloadedAudios={},W(P="lerc-wasm.wasm")||(x=P,P=t.locateFile?t.locateFile(x,d):d+x);var z={a:function(t,n,e,r){O("Assertion failed: "+I(t)+", at: "+[n?I(n):"unknown filename",e,r?I(r):"unknown function"])},c:function(t){return q(t+16)+16},b:function(t,n,e){throw new F(t).init(n,e),t},f:function(){O()},d:function(t,n,e){b.copyWithin(t,n,n+e)},e:function(t){var n,e=b.length,r=2147483648;if((t>>>=0)>r)return!1;for(var i=1;i<=4;i*=2){var o=e*(1+.2/i);if(o=Math.min(o,t+100663296),B(Math.min(r,((n=Math.max(t,o))%65536>0&&(n+=65536-n%65536),n))))return!0}return!1}};!function(){var n={a:z};function e(n,e){var r,i=n.exports;t.asm=i,S((y=t.asm.g).buffer),A=t.asm.m,r=t.asm.h,C.unshift(r),function(n){if(D--,t.monitorRunDependencies&&t.monitorRunDependencies(D),0==D&&H){var e=H;H=null,e()}}()}function i(t){e(t.instance)}function o(t){return function(){if(!m&&(p||h)){if("function"==typeof fetch&&!k(P))return fetch(P,{credentials:"same-origin"}).then((function(t){if(!t.ok)throw"failed to load wasm binary file at '"+P+"'";return t.arrayBuffer()})).catch((function(){return M(P)}));if(a)return new Promise((function(t,n){a(P,(function(n){t(new Uint8Array(n))}),n)}))}return Promise.resolve().then((function(){return M(P)}))}().then((function(t){return WebAssembly.instantiate(t,n)})).then(t,(function(t){g("failed to asynchronously prepare wasm: "+t),O(t)}))}if(D++,t.monitorRunDependencies&&t.monitorRunDependencies(D),t.instantiateWasm)try{return t.instantiateWasm(n,e)}catch(t){return g("Module.instantiateWasm callback failed with error: "+t),!1}(m||"function"!=typeof WebAssembly.instantiateStreaming||W(P)||k(P)||"function"!=typeof fetch?o(i):fetch(P,{credentials:"same-origin"}).then((function(t){return WebAssembly.instantiateStreaming(t,n).then(i,(function(t){return g("wasm streaming compile failed: "+t),g("falling back to ArrayBuffer instantiation"),o(i)}))}))).catch(r)}(),t.___wasm_call_ctors=function(){return(t.___wasm_call_ctors=t.asm.h).apply(null,arguments)},t._lerc_getBlobInfo=function(){return(t._lerc_getBlobInfo=t.asm.i).apply(null,arguments)},t._lerc_getDataRanges=function(){return(t._lerc_getDataRanges=t.asm.j).apply(null,arguments)},t._lerc_decode=function(){return(t._lerc_decode=t.asm.k).apply(null,arguments)},t._lerc_decode_4D=function(){return(t._lerc_decode_4D=t.asm.l).apply(null,arguments)};var L,q=t._malloc=function(){return(q=t._malloc=t.asm.n).apply(null,arguments)};function G(t){this.name="ExitStatus",this.message="Program terminated with exit("+t+")",this.status=t}function X(e){function r(){L||(L=!0,t.calledRun=!0,R||(U(C),n(t),t.onRuntimeInitialized&&t.onRuntimeInitialized(),function(){if(t.postRun)for("function"==typeof t.postRun&&(t.postRun=[t.postRun]);t.postRun.length;)n=t.postRun.shift(),T.unshift(n);var n;U(T)}()))}D>0||(function(){if(t.preRun)for("function"==typeof t.preRun&&(t.preRun=[t.preRun]);t.preRun.length;)n=t.preRun.shift(),j.unshift(n);var n;U(j)}(),D>0||(t.setStatus?(t.setStatus("Running..."),setTimeout((function(){setTimeout((function(){t.setStatus("")}),1),r()}),1)):r()))}if(t._free=function(){return(t._free=t.asm.o).apply(null,arguments)},H=function t(){L||X(),L||(H=t)},t.run=X,t.preInit)for("function"==typeof t.preInit&&(t.preInit=[t.preInit]);t.preInit.length>0;)t.preInit.pop()();return X(),t.ready},r.exports=o;const u=s.exports,a=Object.freeze(function(t,n){for(var e=0;e<n.length;e++){const r=n[e];if("string"!=typeof r&&!Array.isArray(r))for(const n in r)if("default"!==n&&!(n in t)){const e=Object.getOwnPropertyDescriptor(r,n);e&&Object.defineProperty(t,n,e.get?e:{enumerable:!0,get:()=>r[n]})}}return Object.freeze(t)}({__proto__:null,default:u},[s.exports]))},7002:()=>{},5017:()=>{}}]);