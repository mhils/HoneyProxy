define([
    "dojo/_base/declare",
    "../util/_DynamicTemplatedWidget",
    "dojo/text!./templates/ReportOutput.ejs"
], function(declare, _DynamicTemplatedWidget, template) {
 
    return declare([_DynamicTemplatedWidget], {
        templateString: template
    });
 
});