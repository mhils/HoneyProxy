HoneyProxy.PrettyFlow = HoneyProxy.DocumentFlow.extend({
	getPreview: function(callback){
		return HoneyProxy.DocumentFlow.prototype.getPreview.call(this, function($pre){
			$pre.addClass("prettyprint");
			console.warn($pre.html().length);
			if($pre.html().length < 1024*15)
				window.setTimeout(prettyPrint,1);
			else {
				$pre.before($("<div>").addClass("pre-menu-item").text("Prettify").click(prettyPrint));
			}
		});
	}
});
