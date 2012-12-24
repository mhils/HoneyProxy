define([ "lodash", "dojo/_base/declare", "codemirror/all", "dijit/form/Button",
	"../util/sampleFlow", "../util/_DynamicTemplatedWidget",
	"dojo/text!./templates/ReportEditor.ejs" ], function(_, declare,
	CodeMirrorPromise, Button, sampleFlow, _DynamicTemplatedWidget, template) {
	
	return declare([ _DynamicTemplatedWidget ], {
		templateString: template,
		_onShow: function() {
			if (this.codeMirror)
				this.codeMirror.refresh();
		},
		postCreate: function() {
			this.inherited(arguments);
			
			var reportCodeNode = this.reportCodeNode;
			CodeMirrorPromise.then((function(CodeMirror) {
				CodeMirror.commands.autocomplete = function(cm) {
					CodeMirror.simpleHint(cm, CodeMirror.javascriptHint, {
						completeSingle: false,
						additionalContext: {
							//Only expose the important attributes of flow. Most attrs are confusing and for internal use only.
							"flow": {
								"request": sampleFlow.request,
								"response": sampleFlow,
								"getSimilarFlows": sampleFlow.getSimilarFlows
							},
							"traffic": window.HoneyProxy.traffic,
							"_": _
						}
					});
				};
				CodeMirror.commands.autoformat = function(cm) {
					var range = {
						from: cm.getCursor(true),
						to: cm.getCursor(false)
					};
					cm.autoIndentRange(range.from, range.to);
				};
				this.codeMirror = CodeMirror.fromTextArea(reportCodeNode, {
					lineNumbers: true,
					mode: "javascript",
					matchBrackets: true,
					extraKeys: {
						"Enter": "newlineAndIndentContinueComment",
						"Ctrl-Space": "autocomplete",
						"Shift-Ctrl-F": "autoformat"
					},
					onCursorActivity: function() {
						this.codeMirror.matchHighlight("CodeMirror-matchhighlight");
					}
				});
			}).bind(this));
			
			this.startButton = new Button({
				iconClass: "dijitIcon dijitIconFunction"
			}, this.startButtonNode);
		},
		getCode: function() {
			return this.codeMirror ? this.codeMirror.getValue() : "";
		}
	});
	
});