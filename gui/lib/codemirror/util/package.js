// wrapped by build app
define("legacy/package", ["dijit","dojo","dojox"], function(dijit,dojo,dojox){
/*jshint unused:false */
var profile = (function() {
	return {
		resourceTags: {
			amd: function(filename,mid){
				return (mid == "codemirror/main");
			},
			copyOnly: function(filename,mid){
				return (mid == "codemirror/codemirror-combined");
			},
			miniExclude: function(f, m){
				return !(copyOnly(f,m) || amd(f,m));
			}
		}			
	};
})();
});
