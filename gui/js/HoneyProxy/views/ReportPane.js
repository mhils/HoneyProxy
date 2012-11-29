/**
 * Main View
 */
define(["require",
        "dojo/_base/declare",
        "dijit/layout/BorderContainer", 
        "dijit/layout/ContentPane",
        "./ReportEditor"
        ],function(require,declare,BorderContainer,ContentPane,ReportEditor) {
	return declare([BorderContainer], {
		design: "sidebar",
		postCreate: function(){
			this.inherited(arguments);
			
			var reportOutput = new ContentPane({
				id: "reportOutput",
				region: "center",
				splitter: true,
				content:"output"
			});
			
			var reportEditor = new ReportEditor({
				region: "right",
				splitter: true,
			});
			
			//populate trafficPane
			this.addChild(reportOutput);
			this.addChild(reportEditor);
		}
	});
});