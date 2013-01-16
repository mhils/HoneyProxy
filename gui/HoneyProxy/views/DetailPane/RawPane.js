define([ "dojo/_base/declare", "./_DetailViewPane", "dojo/promise/all",
	"../../utilities", "dojo/text!./templates/RawPane.ejs" ], function(declare,
	_DetailViewPane, all, util, template) {
	
	return declare([ _DetailViewPane ], {
		templateString: template,
		title: "Raw",
		loadContent: function() {
			var model = this.get("model");
			//Check if there is still a pending request for loading content.
			//If so, cancel it.
			var lastReqDef = this.get("lastReqDeferred");
			if (lastReqDef)
				lastReqDef.cancel("outdated");
			var lastRespDef = this.get("lastRespDeferred");
			if (lastRespDef)
				lastRespDef.cancel("outdated");
			
			var rawPane = this;
			
			var reqDef = model.request.getContent().then(
				function(content) {
					rawPane.set("requestContent", content !== "" ? content
						: "<empty request content>");
				});
			var respDef = model.response.getContent().then(
				function(content) {
					rawPane.set("responseContent", content !== "" ? content
						: "<empty response content>");
				});
			
			this.set("lastReqDeferred", reqDef);
			this.set("lastRespDeferred", respDef);
			
			return all([ reqDef, respDef ]);
		},
		requestContent: undefined,
		_setRequestContentAttr: util.textContentPolyfill("requestContentNode"),
		responseContent: undefined,
		_setResponseContentAttr: util.textContentPolyfill("responseContentNode")
	});
	
});