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
		
	function handleSearchResults(filterClass,matched){
		console.debug("Search performed:",filterClass,JSON.stringify(matched));
		HoneyProxy.traffic.each(function(child){
			if(child.get("id") == matched[0]) {
				child.removeFilterClass(filterClass)
				matched.shift();
			} else {
				child.addFilterClass(filterClass);
			}
		});
	}
	
	HoneyProxy.search = function(string) {
		var conditions = parseSearchString(string);
		$.getJSON("/api/search",{
			idsOnly: true,
			filter: JSON.stringify(conditions)
		}, handleSearchResults.bind(0,"filter-hide"));
	}
})();



$(function(){
	$("#search").keypress(function(e) {
        if(e.which == 13) {
            //$(this).blur();
            HoneyProxy.search($(this).val());
        }
    });
});