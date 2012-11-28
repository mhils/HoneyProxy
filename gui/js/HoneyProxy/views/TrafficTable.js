define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "../util/_DynamicTemplatedMixin",
    "lodash",
    "dojo/text!./templates/TrafficTable.ejs"
], function(declare, _WidgetBase, _DynamicTemplatedMixin, lodash, template) {
 
    return declare([_WidgetBase, _DynamicTemplatedMixin], {
    	templateCompileFunction: _.template,
        templateString: template,
        postCreate: function(){
        	
        }
    });
 
});