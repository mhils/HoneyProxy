/**
 * Flow subclass responsible for proper display of flows that can be
 * prettyprinted. Subclassed by HTML, JS, ... flows
 */
define(["./DocumentFlow"],function(DocumentFlow){
	
	var autoPretty = 1024 * 15,
	askPretty = 1024 * 300;
	
	var prettyPrint = function($pre){
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
		getPreview : function(domPromise) {
			return DocumentFlow.prototype.getPreview.call(this,domPromise,prettyPrint.bind(this));
		}
	}, {
		'autoPretty': autoPretty,
		'askPretty': askPretty
	});
});