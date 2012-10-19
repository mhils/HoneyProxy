/**
 * Data Model for a flow. This represents a flow in mitmproxy,
 * with all four attributes (request,response,error,version) 
 * plus its HoneyProxy id.
 * For eased access, use model.request and model.response.
 * it provides useful additional attributes employing ES5 getters and setters.
 * 
 * In its current form, this class gets subclassed for different File types (see ./flows/)
 * As this obviously mixes model and view, it is pretty bad practice and should be changed soon.
 * One option is to bend the subclasses over to FlowView. getCategory() is clearly something that should
 * be in the model though.
 */
define(["./Request","./Response"],function(Request,Response){
	return Backbone.Model.extend({
		/**
		 * @return {number} the id of the current flow
		 */
		get id() { //depends on https://github.com/documentcloud/underscore/pull/694
			return this.get("id");
		},
		/**
		 * @return HTML for Preview
		 * TODO: When moving over to views, make this the default view and let DocumentFlow use it.
		 */
		getPreview: function(domPromise, callback){
			var pre_id = _.uniqueId("preview");
			var $pre = $("<pre>").attr("id", pre_id).addClass("preview").text(
					"Loading...");
			
			
			this.response.getContent(function(data) {
				domPromise.then(function(){
					var $pre = $("#" + pre_id).text(data);
					if (_.isFunction(callback))
						callback($pre);
				});
			});
			return $('<div>').append($pre).html();
		},
		getPreviewEmpty: function(){
			return "No response content.";
		},
		/**
		 * Add a filter class to the model. This doesn't affect the model itself,
		 * but a view may listen for a change here.
		 * A filter class basically is added to a view to allow conditional styling
		 */
		addFilterClass: function(cls){
			if(cls in this.getFilterClasses())
				return;
			this.getFilterClasses()[cls] = true;
			this.trigger("filterClass:add",cls);
		},
		removeFilterClass: function(cls){
			if(!(cls in this.getFilterClasses()))
				return;
			delete this.getFilterClasses()[cls];
			this.trigger("filterClass:remove",cls);
		},
		/**
		 * Get a list of all active filter classes.
		 */
		getFilterClasses: function(){
			if(!this.has("filterClasses"))
				this.set("filterClasses",{});
			return this.get("filterClasses");
		},
		getSimilarFlows: function(level,callback) {
			$.getJSON("/api/search",{
				idsOnly: true,
				filter: JSON.stringify([{
					"type":"similarTo",
					"value":this.id+","+level,
					"field":"any"
				}])
			}, callback);
		},
		/**
		 * @return the Request proxy object
		 */
		get request() { //depends on https://github.com/documentcloud/underscore/pull/694
			if(!this._request)
				this._request = new Request(this);
			return this._request;
		},
		/**
		 * @return the Response proxy object
		 */
		get response() { //depends on https://github.com/documentcloud/underscore/pull/694
			if(!this._response)
				this._response = new Response(this);
			return this._response;
		}
	}, {
		/**
		 * Get the category of the current flow
		 */
		getCategory: function(){
			return "none";
		},
		/**
		 * @return true if the current class is a match for the given flow data.
		 */
		matches: function(){
			return false; //favor subclasses
		},
	});
})