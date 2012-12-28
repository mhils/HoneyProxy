define([ "lodash", 
         "dojo/_base/declare", 
         "dojo/_base/array", 
         "dojo/Deferred",
         "dojo/dom-construct", 
         "dojo/on", 
         "dojo/request", 
         "codemirror/all", 
         "dijit/form/Button",
         "../util/sampleFlow", 
         "../util/_DynamicTemplatedWidget",
         "dojo/text!./templates/ReportEditor.ejs" ], function(_, declare, array, Deferred, domConstruct, on, request,
	CodeMirrorPromise, Button, sampleFlow, _DynamicTemplatedWidget, template) {
	
	return declare([ _DynamicTemplatedWidget ], {
		templateString: template,
		_onShow: function() {
			if (this.codeMirror)
				this.codeMirror.refresh();
		},
		postCreate: function() {
			this.inherited(arguments);
			
			var self = this;
			
			CodeMirrorPromise.then(function(CodeMirror) {
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
				self.codeMirror = CodeMirror.fromTextArea(self.reportCodeNode, {
					lineNumbers: true,
					mode: "javascript",
					matchBrackets: true,
					extraKeys: {
						"Enter": "newlineAndIndentContinueComment",
						"Ctrl-Space": "autocomplete",
						"Shift-Ctrl-F": "autoformat"
					},
					onCursorActivity: function() {
						self.codeMirror.matchHighlight("CodeMirror-matchhighlight");
					}
				});
				
				//Editor Synchronization
				var API_PATH = "/api/fs/report_scripts/";
				
				var saveReq, lastState, currentFilename, files = [];
				//Load all available scripts
				request(API_PATH+"?recursive=true",{handleAs:"json"}).then(function(dirs){
					
					var optionsFragment = document.createDocumentFragment();
					array.forEach(dirs,function(dir){
						array.forEach(dir[2],function(file){
							var filename = (dir[0].replace("\\","/") + "/" + file).substr(1);
							var option = domConstruct.create("option", {value: filename, selected: filename=="=intro.js" ? true : false}, optionsFragment);
							option.textContent = filename;
							files.push(filename);
						});
					});
					domConstruct.place(optionsFragment, self.scriptSelectionNode);
					
				});
				function isSaved(){
					return lastState === undefined || lastState === self.getCode();
				}
				function exists(filename){
					return array.indexOf(files, filename) >= 0;
				}
								
				function save(){
					if(isSaved())
						return (new Deferred()).resolve();
					if(saveReq)
						saveReq.cancel();
					
					self.statusNode.textContent = "saving...";
					currentFilename = currentFilename.replace(/[^ \w\.\-\/\\]/g,"");
					var _exists = exists(currentFilename);
					var method = _exists ? request.put : request.post;
					if(!_exists)
						files.push(currentFilename);
					var code = self.getCode();
					saveReq = method(API_PATH + currentFilename, 
						{data:JSON.stringify({"content":code})});
					saveReq.then(function(){
							self.statusNode.textContent = "saved.";
							lastState = code;
							saveReq = null;
					});
					return saveReq;
				}
				function newfile(filename){
					if(exists(filename))
						return load(filename);					
					var option = domConstruct.create("option", {value: filename, selected: true}, self.scriptSelectionNode);
					option.textContent = filename;
					currentFilename = filename;
				}
				function load(filename){
					save().then(function(){
						request.get(API_PATH+filename).then(function(script){
							currentFilename = filename;
							lastState = script;
							self.codeMirror.setValue(script);
						});
						
					});
				}
				
				on(self.newScriptNode,"click",function(){
					newfile(window.prompt("New file name:"));
				});
				self.codeMirror.on("change",function(){
					save();
				});
				
				on(self.scriptSelectionNode,"change",function(){
					console.log("scriptSelectionNode:onChange");
					load(this.options[this.selectedIndex].value);
				});
				load("=intro.js");
				lastState = undefined;
			});
			
			this.startButton = new Button({
				iconClass: "dijitIcon dijitIconFunction"
			}, this.startButtonNode);
		},
		getCode: function() {
			return this.codeMirror ? this.codeMirror.getValue() : "";
		}
	});
	
});