define([ "lodash", 
         "dojo/_base/declare", 
         "dojo/_base/array", 
         "dojo/Deferred",
         "dojo/dom-construct", 
         "dojo/on", 
         "dojo/request", 
         "codemirror",
         "dijit/Toolbar",
         "dijit/form/Button",
         "../traffic",
         "../util/sampleFlow",
         "../util/requestAuthenticator", 
         "../util/_ReactiveTemplatedWidget",
         "dojo/text!./templates/ReportEditor.html" ], function(_, declare, array, Deferred, domConstruct, on, request,
	CodeMirror, Toolbar, Button, traffic, sampleFlow, requestAuthenticator, _ReactiveTemplatedWidget, template) {
	
	return declare([ _ReactiveTemplatedWidget ], {
		templateString: template,
		_onShow: function() {
			if (this.codeMirror)
				this.codeMirror.refresh();
		},
		postCreate: function() {
			this.inherited(arguments);
			
			var self = this;
			
			CodeMirror.commands.autocomplete = function(cm) {
				CodeMirror.simpleHint(cm, CodeMirror.javascriptHint, {
					completeSingle: false,
					additionalContext: {
						//Only expose the important attributes of flow. Most attrs are confusing and for internal use only.
						"flow": {
							"request": sampleFlow.request,
							"response": sampleFlow.response,
							"id": sampleFlow.id,
							"getSimilarFlows": sampleFlow.getSimilarFlows
						},
						"traffic": traffic,
						"detailView": self.detailViewObj,
						"_": _
					}
				});
			};
			CodeMirror.commands.autoformat = function(cm) {
				var range = {
					from: cm.getCursor(true),
					to: cm.getCursor(false)
				};
				if(range.from.ch === range.to.ch && range.from.line === range.to.line)
					range = {"from": {"ch": 0, "line": 0}, "to": {"ch": 0, "line": cm.lineCount()}};
				cm.autoIndentRange(range.from, range.to);
			};
				
			//breaks if -n > options.length
			function increaseSelectedOptionIndex(n){
				var node = self.scriptSelect;
				node.selectedIndex = (n + node.selectedIndex + node.options.length) % node.options.length;
									
				on.emit(self.scriptSelect, "change", {
					bubbles: true,
					cancelable: true
				});
			}
				
			self.codeMirror = CodeMirror.fromTextArea(self.code, {
				lineNumbers: true,
				mode: "javascript",
				tabSize: 2,
				matchBrackets: true,
				extraKeys: {
					"Enter": "newlineAndIndentContinueComment",
					"Ctrl-Enter": function(){ self.submitClick(); },
					"Alt-PageDown": function(){ increaseSelectedOptionIndex(1); },
					"Alt-PageUp" : function(){ increaseSelectedOptionIndex(-1); }, 
					"Ctrl-Space": "autocomplete",
					"Shift-Ctrl-F": "autoformat"
				}
			});
				self.codeMirror.on("cursorActivity", function() {
					self.codeMirror.matchHighlight("CodeMirror-matchhighlight");
				});
				
				//Editor Synchronization
				var API_PATH = "/api/fs/report_scripts/";
				
				var saveReq, lastState, files = {};
				
				
				//Load all available scripts
				request(API_PATH+"?recursive=true",{handleAs:"json"}).then(function(dirs){
					
					var optionsFragment = document.createDocumentFragment();
					array.forEach(dirs,function(dir){
						array.forEach(dir[2],function(file){
							var filename = (dir[0].replace("\\","/") + "/" + file).substr(1);
							var option = domConstruct.create("option", {value: filename, selected: filename === "=intro.js" ? true : false}, optionsFragment);
							option.textContent = filename;
							files[filename] = option;
						});
					});
					domConstruct.place(optionsFragment, self.scriptSelect);
					
				});
				function isSaved(){
					return lastState === self.getCode() || self.get("currentFilename") === undefined;
				}
				function isReadOnly(){
					return self.get("currentFilename").indexOf("=") === 0;
				}
								
				function save(newfile){
					
					if(isSaved() || isReadOnly())
						return (new Deferred()).resolve();
					if(saveReq)
						saveReq.cancel();
					
					var def = new Deferred();
					
					requestAuthenticator.active.then(function(writable){
						if(!writable){
							self.setStatus("read only mode: unsaved",false);
							def.resolve(false);
						}
						else {
							self.setStatus("save...",true);
							self.set("currentFilename",self.get("currentFilename").replace(/[^ \w\.\-\/\\]/g,""));
							var method = newfile ? request.post : request.put;
							var code = self.getCode();
							saveReq = method(API_PATH + self.get("currentFilename"), 
								{data:JSON.stringify({"content":code})});
							saveReq.then(function(){
									self.setStatus("saved.",false);
									lastState = code;
									saveReq = null;
									def.resolve(arguments);
							});
							
						}
					});
					return def;
				}
				function newfile(filename){
					if(filename in files)
						return load(filename);					
					var option = domConstruct.create("option", {value: filename, selected: true}, self.scriptSelect);
					option.textContent = filename;
					self.set("currentFilename",filename);
					self.codeMirror.setValue("\n\n\n\n\n\n\n\n");
					save(true);
				}
				function delfile(filename){
					if(!(filename in files))
						return;
					if(filename == self.get("currentFilename"))
						increaseSelectedOptionIndex(1);
					domConstruct.destroy(files[filename]);
					delete files[filename];
					return request.del(API_PATH+filename);
				}
				function load(filename){
					save().then(function(){
						request.get(API_PATH+filename).then(function(script){
							self.set("currentFilename",filename);
							lastState = (self.get("currentFilename").indexOf("=") < 0 ? script : undefined);
							self.codeMirror.setValue(script);
							self.setStatus("",false);
						});
						
					});
				}
				/*
				on(self.newScriptButton,"click",function(){
					var filename = window.prompt("New file name:");
					if(filename !== null)
						newfile(filename);
				});
				
				on(self.deleteScriptButton,"click",function(){
					var del = window.prompt("Do you really want to delete "+self.get("currentFilename")+"?\nEnter DELETE to continue.");
					if(del === "DELETE")
						delfile(self.get("currentFilename"));
				});*/
				
				
				var saveTimeout;
				self.codeMirror.on("change",function(){
					window.clearTimeout(saveTimeout);
					if(isReadOnly()){
						self.setStatus("read only",false);
					}
					else if(isSaved()){
						self.setStatus("saved.",false);
					} else {
						self.setStatus("",false);
						saveTimeout = window.setTimeout(function(){
							save();
						}, 300);
					}
				});
				/*
				on(self.scriptSelectionNode,"change",function(){
					load(this.options[this.selectedIndex].value);
				});*/
				load("=intro.js");
			
			this.startButton = new Button({
				iconClass: "dijitIcon dijitIconFunction"
			}, this.startButtonNode);
		},
		getCode: function() {
			return this.codeMirror ? this.codeMirror.getValue() : "";
		},
		submitClick: function() {
			//FIXME
		},
		setStatus: function(text,isActive){
			this.active.textContent =  isActive ? text : "";
			this.status.textContent = !isActive ? text : "";
		}
	});
	
});