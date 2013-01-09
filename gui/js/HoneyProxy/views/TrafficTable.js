define([ "dojo/_base/declare", "dojo/dom", "../util/_DynamicTemplatedWidget",
		"dojo/text!./templates/TrafficTable.ejs", "../util/TableSorter" ], function(declare, dom,
	_DynamicTemplatedWidget, template, TableSorter) {
	
	return declare([ _DynamicTemplatedWidget ], {
		templateString: template,
		postCreate: function(){
			var trafficTableSorter = new TableSorter({
				table: this.trafficTable,
				cols: {
					3 : {"sort" : TableSorter.compareNumeric},
					5 : {"sort" : TableSorter.createReverseCompare(TableSorter.compareNumeric)}
				}
			});
			
			trafficTableSorter.activate();
		}
	});
	
});