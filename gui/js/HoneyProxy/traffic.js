define(["./models/Traffic"],function(Traffic){
	
	var traffic = new Traffic;
	
	//FIXME: This should be in Traffic.js
	
	function firstFlowTrigger(traffic){
		if(traffic.length > 0) {
			traffic.trigger("firstflow");
			traffic.off("firstflow");
			traffic.off("newflow",firstFlowTrigger);
			traffic.off("reset",firstFlowTrigger);
		}
	}
	traffic.on("add",firstFlowTrigger);
	traffic.on("reset",firstFlowTrigger);
	
	return traffic;
});