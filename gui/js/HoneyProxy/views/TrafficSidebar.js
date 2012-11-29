define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "../util/_DynamicTemplatedMixin",
    "lodash",
    "dojo/text!./templates/TrafficSidebar.ejs"
], function(declare, _WidgetBase, _DynamicTemplatedMixin, _, template) {
 
    return declare([_WidgetBase, _DynamicTemplatedMixin], {
    	templateCompileFunction: _.template,
        templateString: template
    });
 
});