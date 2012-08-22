/**
 * Add a small link to the directory listener if dirdump is active.
 */
define(["./config","dojo/domReady!"],function(config){
	return {
		initialize: function(){
			if(config.get("dumpdir") === true) {
				$("header").prepend('<a target="_blank" href="/dump">Show dumped files</a>');
			}
		}
	};
});