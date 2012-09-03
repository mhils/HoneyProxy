/**
 * Flow subclass responsible for proper display of CSS files.
 */
define(["./PrettyFlow"],function(PrettyFlow){
	return PrettyFlow.extend({}, {
		matches : function(data) {
			if (data.contentType)
				return !!data.contentType.match(/css/i);
			else if (data.path)
				return !!data.path.match(/\.css$/i);
			return false;
		},
		getCategory : function() {
			return "css";
		}
	});
})