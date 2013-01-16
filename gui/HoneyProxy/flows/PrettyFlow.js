/**
 * Flow subclass responsible for proper display of flows that can be
 * prettyprinted. Subclassed by HTML, JS, ... flows
 */
define(["dojo/Deferred","./DocumentFlow","highlight","dojo/dom-construct","dojo/on"],function(Deferred,DocumentFlow,hljs,domConstruct,on){
	
	var autoPretty = 1024 * 15,
	askPretty = 1024 * 300;
	
	var prettyPrint = function(pre){
		
		var contentLength = pre.innerHTML.length;
		
		if (contentLength < autoPretty) {
			//pre.innerHTML = hljs.highlightAuto(pre.textContent).value;
			hljs.highlightBlock(pre);
		} else if (contentLength < askPretty) {
			var span = domConstruct.create("span");
			var prettifyButton = domConstruct.create("div",{className:"pre-menu-item", innerHTML: "Prettify (slow)"},span);
			on(prettifyButton,"click",function(){
				hljs.highlightBlock(pre);
				domConstruct.destroy(prettifyButton);
			});
			domConstruct.place(pre,span);
			return span;
		}
		return pre;
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