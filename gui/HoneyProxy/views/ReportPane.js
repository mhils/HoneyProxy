/**
 * Main View
 */
/*jshint unused:false */
define(["require",
        "dojo/_base/declare",
        "dijit/layout/BorderContainer", 
        "./_DetailViewMixin"],function(require,declare,BorderContainer,_DetailViewMixin) {
	return declare([BorderContainer, _DetailViewMixin], {
		design: "sidebar",
		_onShow: function(){
			
			this.inherited(arguments);
			var self = this;
			
			//TODO: When refactoring, Move this lazy-loading into MainLayout and lazy-load the complete ReportPane
			require(["dojo/dom-construct",
               "dojo/on",
               "dijit/layout/ContentPane",
               "./ReportEditor",
               "./ReportOutput",],
               function(domConstruct,on,ContentPane,ReportEditor,ReportOutput){
				
        //Little Proxy object for the real detail view to be used in Report Scripts
				var detailViewObj = {
					show: function(flow){
						self.detailView.setModel(flow);
						self.toggleDetails(true);
					},
					hide: function(){
						self.toggleDetails(false);
					}
				};
				
				var reportOutput =  new ReportOutput({
					id: "reportOutput",
					region: "center",
					splitter: true
				});
				self.reportOutput = reportOutput;
				
				var reportEditor = new ReportEditor({
					id: "reportEditor",
					region: "right",
					splitter: true,
					detailViewObj: detailViewObj
				});
				self.reportEditor = reportEditor;
				
				//TODO: Wrap into a correct Controller
				on(reportEditor.startButton,"click",function(){
					
					require(["../traffic"],function(traffic){
						var code = reportEditor.getCode();
						var outNode = reportOutput.outputNode;
						var detailView = detailViewObj;
						detailView.hide();
						domConstruct.empty(outNode);
						var _mid = require.module.mid;
						require.module.mid = "ReportScripts/" + reportEditor.get("currentFilename");
						try {
							/*jshint evil:true */
							eval(code);
						} catch(e) {
							//TODO: This is ugly.
							outNode.innerHTML = "<pre>" + e.message + "\n\n"+e.stack.replace(/\(http.+?@localhost:8081/g,"") + "</pre>";
							console.log(e);
							window.HoneyProxy.exception = e;
						}
						require.module.mid = _mid;
						
					});
				});
				
				//populate trafficPane
				self.addChild(self.reportOutput);
				self.addChild(self.reportEditor);
				
				self.reportEditor._onShow(); //TODO: little bit dirty. maybe replace with .watch("selected"). See how dojo 2.0 handles this
			});
			
		},
		postCreate: function(){
			
		}
		
	});
});