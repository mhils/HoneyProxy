/* Modernizr 2.6.2 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-flexboxlegacy-cssgradients-websockets-prefixes-domprefixes
 */
;window.Modernizr=function(a,b,c){function x(a){i.cssText=a}function y(a,b){return x(l.join(a+";")+(b||""))}function z(a,b){return typeof a===b}function A(a,b){return!!~(""+a).indexOf(b)}function B(a,b,d){for(var e in a){var f=b[a[e]];if(f!==c)return d===!1?a[e]:z(f,"function")?f.bind(d||b):f}return!1}var d="2.6.2",e={},f=b.documentElement,g="modernizr",h=b.createElement(g),i=h.style,j,k={}.toString,l=" -webkit- -moz- -o- -ms- ".split(" "),m="Webkit Moz O ms",n=m.split(" "),o=m.toLowerCase().split(" "),p={},q={},r={},s=[],t=s.slice,u,v={}.hasOwnProperty,w;!z(v,"undefined")&&!z(v.call,"undefined")?w=function(a,b){return v.call(a,b)}:w=function(a,b){return b in a&&z(a.constructor.prototype[b],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(b){var c=this;if(typeof c!="function")throw new TypeError;var d=t.call(arguments,1),e=function(){if(this instanceof e){var a=function(){};a.prototype=c.prototype;var f=new a,g=c.apply(f,d.concat(t.call(arguments)));return Object(g)===g?g:f}return c.apply(b,d.concat(t.call(arguments)))};return e}),p.flexboxlegacy=function(){return testPropsAll("boxDirection")},p.websockets=function(){return"WebSocket"in a||"MozWebSocket"in a},p.cssgradients=function(){var a="background-image:",b="gradient(linear,left top,right bottom,from(#9f9),to(white));",c="linear-gradient(left top,#9f9, white);";return x((a+"-webkit- ".split(" ").join(b+a)+l.join(c+a)).slice(0,-a.length)),A(i.backgroundImage,"gradient")};for(var C in p)w(p,C)&&(u=C.toLowerCase(),e[u]=p[C](),s.push((e[u]?"":"no-")+u));return e.addTest=function(a,b){if(typeof a=="object")for(var d in a)w(a,d)&&e.addTest(d,a[d]);else{a=a.toLowerCase();if(e[a]!==c)return e;b=typeof b=="function"?b():b,typeof enableClasses!="undefined"&&enableClasses&&(f.className+=" "+(b?"":"no-")+a),e[a]=b}return e},x(""),h=j=null,e._version=d,e._prefixes=l,e._domPrefixes=o,e._cssomPrefixes=n,e}(this,this.document);


var features = ["websockets","flexboxlegacy","cssgradients"];
var i = features.length;
while(i--){
	if(Modernizr[features[i]] !== true){
		alert("Your browser does not support "+features[i]+". Some features of HoneyProxy won't work. Please upgrade your browser for a better experience. We support both Firefox and Chrome.");
		//break;
	}
}