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
			if(!this.lazyLoaded) {
				this.lazyLoaded = true;
			
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
						detailViewObj.hide();
						domConstruct.empty(reportOutput.outputNode);
						var _mid = require.module.mid;
						require.module.mid = "ReportScripts/" + reportEditor.get("currentFilename");
						try {
							/*jshint evil:true */
							
							// https://developers.google.com/closure/compiler/docs/compilation_levels
							// Compilation [...] always preserves the functionality of syntactically valid JavaScript, 
							// provided that the code does not access local variables using string names (by using eval() statements, for example).
							window._reportPaneExterns = {
								outNode: reportOutput.outputNode,
								traffic: traffic,
								detailView: detailViewObj,
								require: require,
								_: _,
								$: $
							};
							with(window._reportPaneExterns) {
								eval(code);
							}
							delete window._reportPaneExterns;
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
			}
		},
		selectFlow: function(flowId){
			require(["./../traffic","./../MainLayout"],(function(traffic,MainLayout){
				var model = traffic.get(flowId);
				this.detailView.setModel(model);
			}).bind(this));
		},
		postCreate: function(){
			this.inherited(arguments);
		}
		
	});
});