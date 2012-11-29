define([
    "dojo/_base/declare",
    "../util/_DynamicTemplatedWidget",
    "dojo/text!./templates/ReportEditor.ejs"
], function(declare, _DynamicTemplatedWidget, template) {
 
    return declare([_DynamicTemplatedWidget], {
        templateString: template
    });
 
});