/**
 * Little subclass with default settings for _DynamicTemplatedMixin
 */
define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "lodash",
    "./_DynamicTemplatedMixin"
],function(declare, _WidgetBase, _, _DynamicTemplatedMixin){
	
	return declare([_WidgetBase, _DynamicTemplatedMixin], {
		templateCompileFunction: _.template,
		_ : _ //make lodash available for template files
	});
});
