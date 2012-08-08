HoneyProxy.Flow = Backbone.Model.extend({
	getId: function(){
		return this.get("id");
	},
	getCategory: function(){
		return "none";
	},
	matches: function(){
		return false;
	},
	getPreview: function(){
		return HoneyProxy.DocumentFlow.prototype.getPreview.apply(this);
		//return "no preview mode available.";
		/* TODO */
	}
});

//Workaround, underscore does not copy properties correctly
//FIXME: https://github.com/documentcloud/underscore/pull/694
Object.defineProperties(HoneyProxy.Flow.prototype, 
		{ "request":  { get: function(){
			if(!this._request)
				this._request = new Request(this);
			return this._request;
			}},
		  "response": { get: function(){
			if(!this._response)
				this._response = new Response(this);
			return this._response;
			}}});




