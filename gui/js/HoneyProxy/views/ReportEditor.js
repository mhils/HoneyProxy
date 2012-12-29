define([ "lodash", 
         "dojo/_base/declare", 
         "dojo/_base/array", 
         "dojo/Deferred",
         "dojo/dom-construct", 
         "dojo/on", 
         "dojo/request", 
         "codemirror/all",
         "dijit/Toolbar",
         "dijit/form/Button",
         "../traffic",
         "../util/sampleFlow", 
         "../util/_DynamicTemplatedWidget",
         "dijit/_WidgetsInTemplateMixin",
         "dojo/text!./templates/ReportEditor.ejs" ], function(_, declare, array, Deferred, domConstruct, on, request,
	CodeMirrorPromise, Toolbar, Button, traffic, sampleFlow, _DynamicTemplatedWidget, _WidgetsInTemplateMixin, template) {
	
	return declare([ _DynamicTemplatedWidget, _WidgetsInTemplateMixin ], {
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
							"traffic": traffic,
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
				
				//breaks if -n > options.length
				function increaseSelectedOptionIndex(n){
					var node = self.scriptSelectionNode;
					node.selectedIndex = (n + node.selectedIndex + node.options.length) % node.options.length;
										
					on.emit(self.scriptSelectionNode, "change", {
						bubbles: true,
						cancelable: true
					});
				}
				
				self.codeMirror = CodeMirror.fromTextArea(self.reportCodeNode, {
					lineNumbers: true,
					mode: "javascript",
					matchBrackets: true,
					extraKeys: {
						"Enter": "newlineAndIndentContinueComment",
						"Ctrl-Enter": function(){ self.startButton.onClick(); },
						"Alt-PageDown": function(){ increaseSelectedOptionIndex(1); },
						"Alt-PageUp" : function(){ increaseSelectedOptionIndex(-1); }, 
						"Ctrl-Space": "autocomplete",
						"Shift-Ctrl-F": "autoformat"
					},
					onCursorActivity: function() {
						self.codeMirror.matchHighlight("CodeMirror-matchhighlight");
					}
				});
				
				//Editor Synchronization
				var API_PATH = "/api/fs/report_scripts/";
				
				var saveReq, lastState, currentFilename, files = {};
				
				
				//Load all available scripts
				request(API_PATH+"?recursive=true",{handleAs:"json"}).then(function(dirs){
					
					var optionsFragment = document.createDocumentFragment();
					array.forEach(dirs,function(dir){
						array.forEach(dir[2],function(file){
							var filename = (dir[0].replace("\\","/") + "/" + file).substr(1);
							var option = domConstruct.create("option", {value: filename, selected: filename=="=intro.js" ? true : false}, optionsFragment);
							option.textContent = filename;
							files[filename] = option;
						});
					});
					domConstruct.place(optionsFragment, self.scriptSelectionNode);
					
				});
				function isSaved(){
					return lastState === self.getCode() || currentFilename === undefined || currentFilename == "=intro.js";
				}
								
				function save(newfile){
					if(isSaved()) {
						self.statusNode.textContent = "saved.";
						return (new Deferred()).resolve();
					}
					if(saveReq)
						saveReq.cancel();
					
					self.statusNode.textContent = "saving...";
					currentFilename = currentFilename.replace(/[^ \w\.\-\/\\]/g,"");
					var method = newfile ? request.post : request.put;
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
					if(filename in files)
						return load(filename);					
					var option = domConstruct.create("option", {value: filename, selected: true}, self.scriptSelectionNode);
					option.textContent = filename;
					currentFilename = filename;
					self.codeMirror.setValue("\n\n\n\n\n\n\n\n");
					save(true);
				}
				function delfile(filename){
					if(!(filename in files))
						return;
					if(filename == currentFilename)
						increaseSelectedOptionIndex(1);
					domConstruct.destroy(files[filename]);
					delete files[filename];
					return request.del(API_PATH+filename);
				}
				function load(filename){
					save().then(function(){
						request.get(API_PATH+filename).then(function(script){
							currentFilename = filename;
							lastState = (currentFilename.indexOf("=") < 0 ? script : undefined);
							self.codeMirror.setValue(script);
							self.statusNode.textContent = "";
						});
						
					});
				}
				
				on(self.newScriptButton,"click",function(){
					var filename = window.prompt("New file name:");
					if(filename !== null)
						newfile(filename);
				});
				
				on(self.deleteScriptButton,"click",function(){
					var del = window.prompt("Do you really want to delete "+currentFilename+"?\nEnter DELETE to continue.");
					if(del === "DELETE")
						delfile(currentFilename);
				});
				
				
				var saveTimeout;
				self.codeMirror.on("change",function(){
					window.clearTimeout(saveTimeout);
					self.statusNode.textContent = "";
					saveTimeout = window.setTimeout(function(){
						save();
					}, 300);
				});
				
				on(self.scriptSelectionNode,"change",function(){
					load(this.options[this.selectedIndex].value);
				});
				load("=intro.js");
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