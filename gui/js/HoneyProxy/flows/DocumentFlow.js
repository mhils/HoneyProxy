/**
 * Flow subclass responsible for proper display of general files. Basically
 * loading file content into a pre tag. Most other flow classes inherit from
 * this.
 */
define(["../models/Flow"],function(Flow){
	return Flow.extend(
			{}, 
			{
				matches : function(data) {
					if (data.contentType)
						return !!data.contentType.match(/application|text/i);
					return false;
				},
				getCategory : function() {
					return "document";
				}
			}
		);
});