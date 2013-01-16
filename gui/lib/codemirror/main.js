/*
 * CodeMirror AMD wrapper. Returns a promise that gets fulfiled when codemirror and all plugins have been loaded.
 */
define(["./codemirror-combined"],function(){
		return window.CodeMirror;
});