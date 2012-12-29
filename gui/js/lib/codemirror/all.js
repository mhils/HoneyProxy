/*
 * CodeMirror AMD wrapper. Returns a promise that gets fulfiled when codemirror and all plugins have been loaded.
 */
define(["require","dojo/Deferred","./codemirror"],function(require,Deferred){
	var def = new Deferred();
	require(["./mode-javascript",
	         "./util/continuecomment",
	         "./util/formatting",
	         "./util/simple-hint",
	         "./util/javascript-hint",
	         "./util/matchbrackets",
	         "./util/searchcursor",
	         "./util/match-highlighter"],
	         function(){
		def.resolve(window.CodeMirror);
	});
	return def;
});