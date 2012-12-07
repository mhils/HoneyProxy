/**
 * Main View
 */
define(["require",
        "dojo/_base/declare",
        "dojo/dom-construct",
        "dijit/layout/BorderContainer", 
        "dijit/layout/ContentPane",
        "./ReportEditor",
        "./ReportOutput",
        "dojo/on"
        ],function(require,declare,domConstruct,BorderContainer,ContentPane,ReportEditor,ReportOutput,on) {
	return declare([BorderContainer], {
		design: "sidebar",
		postCreate: function(){
			this.inherited(arguments);
			
			var reportOutput = new ReportOutput({
				id: "reportOutput",
				region: "center",
				splitter: true
			});
			
			var reportEditor = new ReportEditor({
				id: "reportEditor",
				region: "right",
				splitter: true
			});
			

			//TODO: Wrap into a correct Controller
			on(reportEditor.startButton,"click",function(){
				require(["../traffic"],function(traffic){
					
					var code = reportEditor.getCode();
					var outNode = reportOutput.outputNode;
					domConstruct.empty(outNode);
					try {
						eval(code);
					} catch(e) {
						//TODO: This is ugly.
						outNode.innerHTML = "<pre>" + e.message + "\n\n"+e.stack.replace(/\(http.+?@localhost:8081/g,"") + "</pre>";
						console.log(e);
						window.e = e;
					}
					
				});
			});
			
			//populate trafficPane
			this.addChild(reportOutput);
			this.addChild(reportEditor);
		}
	});
});