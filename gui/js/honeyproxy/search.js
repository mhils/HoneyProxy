(function(){
	
	var parseExp = /([\w\.]+)(==|<|>|~=)(.+)/;
	
	function parseSearchString(string) {
		
		var parts = [string.trim()];
		//.replace(/\s*(==|<|>|~=)\s*/g,"$1")]
		//.split(" "); //alternatively use a textfield and \n as sep.
		
		var conditions = [];
		_.each(parts,function(part) {
			if(part == "")
				return;
			var negate = false;
			var type = "contains";			
			
			if(part.charAt(0) == "!"){
				negate = true;
				part = part.substring(1);
			}
			if(part.charAt(0) == "~"){
				type = "regexp";
				part = part.substring(1);
			}
			
			//try to parse expression
			/* We go the easy way first. This is better in terms of UX
			var parsed = parseExp.exec(part);
			if(!parsed) {
				parsed = [null,"any",part];
			}
			condition = {
				"field":parsed[1],
				"value":parsed[2],
				"type" :type
			};
			*/
			var condition = {
					"field": "any",
					"value": part,
					"type": type
			}
			if(negate)
				condition["not"] = true;
			conditions.push(condition);
		});
		return conditions;
	}
		
	function handleSearchResults(filterClass,ids,matched){
		console.debug("Search performed:",filterClass,JSON.stringify(matched));
		
		function handleFlow(flow){
			if(flow.get("id") == matched[0]) {
				flow.removeFilterClass(filterClass)
				matched.shift();
			} else {
				flow.addFilterClass(filterClass);
			}
		}
		if(ids === undefined)
			HoneyProxy.traffic.each(handleFlow);
		else
			_.each(ids,function(id){
				handleFlow(HoneyProxy.traffic.get(id));
			})
	}
	
	HoneyProxy.search = function(string,ids) {
	    HoneyProxy._searchActive = (string.trim()!=="");
		var conditions = parseSearchString(string);
		$.getJSON("/api/search",{
			idsOnly: true,
			in: JSON.stringify(ids),
			includeContent: $("#includeContent").prop("checked"),
			filter: JSON.stringify(conditions)
		}, handleSearchResults.bind(0,"filter-hide",ids));
	}
})();



$(function(){
	function doSearch(ids){
		HoneyProxy.search($("#search").val(),ids);
	}
	$("#search").keypress(function(e) {
        if(e.which == 13) {
            doSearch();
        }
    });
	$("#includeContent").on("change",doSearch.bind(null,undefined));
	
	HoneyProxy.traffic.on("add",function(flow){
		if(HoneyProxy._searchActive){
			flow.addFilterClass("filter-hide");
			doSearch([flow.get("id")]);
		}
	});
});