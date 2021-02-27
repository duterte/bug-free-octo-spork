/*! rulez.js 2019-09-18 */
!function(a,b){"object"==typeof module&&"object"==typeof module.exports?module.exports=a.document?b(a,!0):function(a){if(!a.document)throw new Error("rulez.js requires a window with a document");return b(a)}:b(a)}("undefined"!=typeof window?window:this,function(a,b){var c=function(b){"use strict";function c(b){var d,e=b.cloneNode(!1);if(b instanceof Element){var f=a.getComputedStyle(b);if(f)for(d=0;d<f.length;d++){var g=f[d];e.style.setProperty(g,f.getPropertyValue(g),"")}}for(d=0;d<b.childNodes.length;d++)e.appendChild(c(b.childNodes[d]));return e}function d(){R||G.divisions.forEach(function(a){a.pixelGap>R&&(R=a.pixelGap)}),I=J-J%R+R*L,H=-R*L}function e(a,b){G.divisions.forEach(function(c){f(a,b,c)});var c=0;G.texts.forEach(function(d){var e=m(a,b,d);N[c]?N[c]=N[c].concat(e):N.push(e),c++})}function f(a,b,c){for(var d=a;d<b;d+=c.pixelGap){var e=n(d,c);M.appendChild(e),c.renderer&&c.renderer(e)}}function g(){G.guides.forEach(function(a){h(a)})}function h(a){var b=l(a);O.push(b),j(b,a),M.appendChild(b),a.renderer&&a.renderer(b)}function i(a,b){var c=-P%(R*K),d=b.position/Q-P-c;a.setAttribute("transform",v()?"translate(0,"+d+")":"translate("+d+",0)")}function j(a,b){var c,d=b.position,e=v(),f=e?"pageY":"pageX",g=e?"rulez-guide-vert-global":"rulez-guide-horiz-global",h=e?"Y : ":"X : ",j=e?10:0,l=e?0:10,m=document.createElement("span");m.classList.add("rulez-position-element");var n=function(a){m.innerText=h+b.position,m.style.left=a.pageX+j+"px",m.style.top=a.pageY+l+"px"},o=function(e){e.preventDefault();var g=e[f],h=c-g;if(b.position=d-h*Q,e.shiftKey){var j=G.guideSnapInterval/2,k=b.position%G.guideSnapInterval,l=Math.abs(k),m=k;l>j?(m=Math.sign(k)*(G.guideSnapInterval-l),b.position=Math.round(b.position+m)):b.position=Math.round(b.position-m)}else b.position=Math.round(b.position);n(e),i(a,b)},p=function(a){document.body.classList.remove(g),document.body.removeChild(m),document.removeEventListener("mousemove",o),document.removeEventListener("mouseup",p)};a.addEventListener("mousedown",function(a){a.stopPropagation(),document.body.classList.add(g),c=a[f],d=b.position,n(a),document.body.appendChild(m),document.addEventListener("mouseup",p),document.addEventListener("mousemove",o)},!0),a.addEventListener("dblclick",function(){k(a,b)})}function k(a,b){O=O.filter(function(b){return b!==a}),G.guides=G.guides.filter(function(a){return a!==b}),a.parentNode.removeChild(a)}function l(a){return o(a)}function m(a,b,c){for(var d=[],e=a;e<b;e+=c.pixelGap){var f=t(e,c);M.appendChild(f),c.renderer&&c.renderer(f),d.push(f)}return d}function n(a,b){switch(b.type){case"line":return p(a,b);case"rect":default:return q(a,b)}}function o(a){var b=s(0,a.className,a.getSize(a),a.strokeWidth,0);return i(b,a),b}function p(a,b){return r(a,b.className,b.lineLength,b.strokeWidth)}function q(a,b){return s(a,b.className,b.lineLength,b.strokeWidth)}function r(b,c,d,e){var f,g,h,i,j=a.document.createElementNS(D,"line"),k=w();return v()?(f="y1",g="y2",h="x1",i="x2"):(f="x1",g="x2",h="y1",i="y2"),j.setAttribute("class",c),j.setAttribute(f,z(b)),j.setAttribute(g,z(b)),j.setAttribute(h,z(k?"0":x()-d)),j.setAttribute(i,z(k?d:x())),j.setAttribute("stroke-width",z(e)),j}function s(b,c,d,e,f){var g,h,i,j,k=a.document.createElementNS(D,"rect"),l=w();v()?(g="y",h="x",i="width",j="height"):(g="x",h="y",i="height",j="width");var m=void 0!==f?f:l?"0":x()-d;return k.setAttribute("class",c),k.setAttribute(g,z(b)),k.setAttribute(h,z(m)),k.setAttribute(i,z(d)),k.setAttribute(j,z(e)),k}function t(b,c){var d,e,f=a.document.createElementNS(D,"text"),g=C(c);return f.setAttribute("class",c.className),v()?(d="y",e="x"):(d="x",e="y"),f.origPos=b,f.origPosAttribute=d,f.setAttribute(d,z(b)),f.setAttribute(e,z(g)),B(f,c),f.textContent=c.showUnits?z(b):b,c.centerText&&f.setAttribute("text-anchor","middle"),f}function u(){return a.document.createElementNS(D,"g")}function v(){return"vertical"===G.layout}function w(){return!("bottom"===G.alignment||"right"===G.alignment)}function x(){return v()?G.width:G.height}function y(a,b,c){if(!b)return a;for(var d in b)if(b.hasOwnProperty(d))switch(d){case"divisionDefaults":case"textDefaults":case"guideDefaults":y(a[d],b[d]);break;default:c&&a[d]||(a[d]=b[d])}return a.divisions&&a.divisions.forEach(function(b){y(b,a.divisionDefaults,b),b.className||(b.className="line"===b.type?"rulez-line":"rulez-rect")}),a.texts&&a.texts.forEach(function(b){y(b,a.textDefaults,b)}),a.guides&&a.guides.forEach(function(b){y(b,a.guideDefaults,b)}),a}function z(a){return a+G.units}function A(){if(""===G.units||"px"===G.units)return 1;var b=a.document.createElement("div");b.style.position="absolute",b.style.top="-100000px",b.style.left="-100000px",b.style.zIndex=-1e5,b.style.width=b.style.height=z(1),a.document.body.appendChild(b);var c=a.getComputedStyle(b).width.replace("px","");return a.document.body.removeChild(b),c}function B(a,b){var c,d=a.origPos,e=C(b);c=v()?"rotate("+b.rotation+" "+e*K+" "+d*K+")":"rotate("+b.rotation+" "+d*K+" "+e*K+")",a.setAttribute("transform",c)}function C(a){return w()?a.offset:x()-a.offset}var D="http://www.w3.org/2000/svg",E={width:null,height:null,element:null,layout:"horizontal",alignment:"top",units:"",divisionDefaults:{strokeWidth:1,type:"rect",className:"rulez-rect",renderer:null},textDefaults:{rotation:0,offset:25,className:"rulez-text",showUnits:!1,centerText:!0,renderer:null},guideDefaults:{strokeWidth:1,getSize:function(){return 5e3}},divisions:[{pixelGap:5,lineLength:5},{pixelGap:25,lineLength:10},{pixelGap:50,lineLength:15},{pixelGap:100,lineLength:20}],texts:[{pixelGap:100}],guides:[],guideSnapInterval:10},F=function(){var a=JSON.parse(JSON.stringify(E));return a.guideDefaults.getSize=E.guideDefaults.getSize,a},G=y(F(),b);G.guideDefaults.className||(v()?G.guideDefaults.className="rulez-guide-vert":G.guideDefaults.className="rulez-guide-horiz"),G=y(G,G);var H,I,J,K,L=2,M=u(),N=[],O=[],P=0,Q=1,R=0;this.render=function(){G.width||(G.width=G.element.getBoundingClientRect().width),G.height||(G.height=G.element.getBoundingClientRect().height),G.element.appendChild(M=u()),J=v()?G.height:G.width,K=A(),d(),e(H,I),g(),this.scrollTo(0,!1),G.element.addEventListener("dblclick",function(a){var b=v()?a.offsetY:a.offsetX;b=(P+b)*Q;var c=Object.assign({position:b},G.guideDefaults);G.guides.push(c),h(c)})},this.scrollTo=function(a,b){P=a,b&&(P*=K),v()?M.setAttribute("transform","translate(0,"+-P%(R*K)+")"):M.setAttribute("transform","translate("+-P%(R*K)+",0)");for(var c=P/K,d=0;d<G.texts.length;d++)for(var e=G.texts[d],f=N[d],g=R/e.pixelGap,h=c%R,j=c-h,k=0;k<f.length;k++){var l=f[k],m=Math.floor((j+(k-L*g)*e.pixelGap)*Q);e.showUnits&&(m=z(m)),l.textContent=m,e.renderer&&e.renderer(l)}for(d=0;d<O.length;d++)i(O[d],G.guides[d])},this.setScale=function(a){Q=a,this.scrollTo(P,!1)},this.resize=function(){var a=J,b=v()?G.element.clientHeight:G.element.clientWidth;if(a!==b)if(a>b);else{J=b;var c=I;d(),e(c,I),this.scrollTo(P,!1)}},this.getGuideConfigs=function(){return JSON.parse(JSON.stringify(G.guides))},this.saveAsImage=function(b){var d=c(G.element);d.setAttribute("width",G.width),d.setAttribute("height",G.height);var e=a.document.createElement("canvas");e.setAttribute("width",G.width),e.setAttribute("height",G.height);var f=e.getContext("2d"),g=a.URL||a.webkitURL,h=new Image;h.style.position="absolute",h.style.top="-100000px",h.style.left="-100000px",h.style.zIndex=-1e5,h.setAttribute("width",G.width),h.setAttribute("height",G.height);var i=new Blob([d.outerHTML],{type:"image/svg+xml;charset=utf-8"}),j=g.createObjectURL(i);h.onload=function(){setTimeout(function(){f.drawImage(h,0,0),g.revokeObjectURL(j),a.document.body.removeChild(h),b(e.toDataURL())},1e3)},a.document.body.appendChild(h),h.src=j},this.getUnitConversionRate=function(){return A()}};return b||(a.Rulez=c),c});