define(["./flow/FlowStore","dojo/store/Observable"],function(FlowStore, Observable){
	
	var flowStore = new Observable(new FlowStore());

	return flowStore;
});