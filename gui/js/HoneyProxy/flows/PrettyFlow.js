/**
 * Flow subclass responsible for proper display of flows that can be
 * prettyprinted. Subclassed by HTML, JS, ... flows
 */
define(["dojo/Deferred","./DocumentFlow"],function(Deferred,DocumentFlow){
	
	var autoPretty = 1024 * 15,
	askPretty = 1024 * 300;
	
	var prettyPrint = function($pre){
		return $pre;
		$pre.addClass("prettyprint linenums");

		var contentLength = $pre.html().length;
		if (contentLength < autoPretty) {
			//FIXME: Still necessary?
			window.setTimeout(window.prettyPrint, 1);
		} else if (contentLength < askPretty) {
			$pre.before($("<div>").addClass("pre-menu-item").text(
					"Prettify (slow)").click(function() {
				window.prettyPrint();
				$(this).hide('slow');
			}));
		}
	};
	
	return DocumentFlow.extend({
		prettyPrint : prettyPrint,
		getPreview : function() {
			var deferred = new Deferred();
			DocumentFlow.prototype.getPreview.call(this)
			.then(function(pre){
					deferred.resolve(prettyPrint(pre));
				});
			return deferred;
		}
	}, {
		'autoPretty': autoPretty,
		'askPretty': askPretty
	});
});