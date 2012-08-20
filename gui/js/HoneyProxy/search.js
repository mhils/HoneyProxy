/**
 * HoneyProxy search & highlight feature.
 * Parses search strings, and handles search requests.
 * 
 * Terminology:
 * A filter is an expression that filters flows for a given criteria.
 * Searching means applying a filter to the flows and hiding all flows that don't match.
 * Highlighting means applying a filter to the flows and marking all flows that match.
 */
(function(){
	
	//var parseExp = /([\w\.]+)(==|<|>|~=)(.+)/;
	
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
			if(part.charAt(0) == "="){
				type = "containsStrict";
				part = part.substring(1);
			}
			if(part.charAt(0) == "~"){
				type = "regexp";
				part = part.substring(1);
			}
			
			//try to parse expression
			// We go the easy way first. This is better in terms of UX
			/*
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
					"type": type,
					"not": negate
			};
			conditions.push(condition);
		});
		return conditions;
	}
	
	/**
	 * Handles incoming search results. adds and removes the 
	 * given filterClass.
	 */
	function handleSearchResults(filterClass,negate,ids,matched){
		console.debug("Search performed:",arguments);
		function handleFlow(flow){
			if ((flow.get("id") == matched[0]) ^ negate) {
				flow.addFilterClass(filterClass)
			} else {
				flow.removeFilterClass(filterClass);
			}
			if(flow.get("id") == matched[0])
				matched.shift();
		}
		if(ids === undefined)
			HoneyProxy.traffic.each(handleFlow);
		else
			_.each(ids,function(id){
				handleFlow(HoneyProxy.traffic.get(id));
			})
	}
	/**
	 * @param filterClass
	 * the filterClass that should be applied to the flows
	 * @param negate 
	 * true, if filterClass should be applied to flows that match,
	 * false, if filterClass should be applied to flows that don't.
	 */
	HoneyProxy.search = function(filterClass,string,negate,ids) {
		//disable filter if content is empty.
		if(string.trim() == "") {
			return handleSearchResults(filterClass,false,undefined,[]);
		}
		var conditions = parseSearchString(string);
		$.getJSON("/api/search",{
			idsOnly: true,
			"in": JSON.stringify(ids),
			includeContent: $("#includeContent").prop("checked"),
			filter: JSON.stringify(conditions)
		}, handleSearchResults.bind(0,filterClass,negate,ids));
	}
})();

/**
 * DOM part of the search/highlight feature.
 * Basically just reacting on VK_ENTER and blur events,
 * also applies existing filters to incoming requests.
 * One could argue that this is a feature which should be present
 * in the HoneyProxy controller, but that would make the whole thing
 * just complicated.
 */
$(function(){
	
	function search($el,ids){
		$el.data("active",$el.val().trim() !== "");
		return HoneyProxy.search("filter-"+($el.data("filterclass").split(" ").join(" filter-")),$el.val(),$el.data("negate"),ids);
	}
	
	var searchFields = $(".search");
	
	searchFields.on("keypress",function(e){
		if(e.which == 13) {
			search($(this));
        }
	}).on("blur",function(){
		search($(this));
	});

	$("#includeContent").on("change",
			searchFields.trigger.bind(
					searchFields,"blur"));
	
	HoneyProxy.traffic.on("add",function(flow){
		//premium handling of the filter to avoid flickering
		if($("#filter").data("active")===true)
			flow.addFilterClass("filter-hide");
		
		searchFields.each(function(index,el){
			var $el = $(el);
			if($el.data("active") === true) {
				search($el,[flow.get("id")]);
			}
		});
	});
	
});