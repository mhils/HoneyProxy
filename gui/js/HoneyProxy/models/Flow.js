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
	},
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
	getFilterClasses: function(){
		if(!this.has("filterClasses"))
			this.set("filterClasses",{});
		return this.get("filterClasses");
	},
	/*
	setFilteredOut: function(b) {
		if(this._filteredOut == b)
			return;
		
		//FIXME: use events for this
		if(this._flowView)
			this._flowView.setFilteredOut(b);
		
		this._filteredOut = b;
	},*/
	isFilteredOut: function(){
		return this._filteredOut
	},
	get request() { //depends on https://github.com/documentcloud/underscore/pull/694
		if(!this._request)
			this._request = new Request(this);
		return this._request;
	},
	get response() { //depends on https://github.com/documentcloud/underscore/pull/694
		if(!this._response)
			this._response = new Response(this);
		return this._response;
	}
});

//Workaround, underscore does not copy properties correctly
//FIXME: https://github.com/documentcloud/underscore/pull/694
/*Object.defineProperties(HoneyProxy.Flow.prototype, 
		{ "request":  { get: function(){
			if(!this._request)
				this._request = new Request(this);
			return this._request;
			}},
		  "response": { get: function(){
			if(!this._response)
				this._response = new Response(this);
			return this._response;
			}}});*/




