/**
 * Add a small link to the directory listener if dirdump is active.
 */
define(["dijit/form/Button","./config","./MainLayout"],function(Button,config,MainLayout){
	if(config.get("dumpdir") === true) {
		
		new Button({
    		label: "Show dumped files",
    		iconClass: "dijitIcon dijitIconFolderOpen",
    		onClick: function(){
    			window.open("/dump");
    		}
    	}).placeAt(MainLayout.header.toolbarNode);
		
	}
	return config.get("dumpdir");
});