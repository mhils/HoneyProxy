/**
 * Sort the main traffic table
 */
define([
        "dojo/_base/declare","dojo/query","dojo/on","dojo/dom-class","dojo/_base/array","dojo/domReady!"],
        function(declare, query, on, domClass, array){

	var TableSorter = declare(null, {
		sortedCls: "tablesorter-sorted",
		reverseCls: "tablesorter-sorted-reverse",
		
		table: undefined,
		
		constructor: function(args){
			declare.safeMixin(this,args);
			this.thead = this.thead || query("> .header > thead",this.table)[0];
			this.tbody = this.tbody || query("> .scroll > .data > tbody", this.table)[0];
			this.cols = this.cols || {};	
			this.active = { 
				col:undefined,
				reversed:false
				};
		},
		sort: function(th){
			var column = th.cellIndex;
			
			if(!(column in this.cols))
				this.cols[column] = {};

			//reverse if clicked again
			if(this.active.col && this.active.col.cellIndex == column)
				this.active.reverse = !this.active.reverse;
			else
				this.active.reverse = false;
			
			//change header classes
			if(this.active.col)
				domClass.remove(this.active.col,[this.sortedCls,this.reverseCls]);
			domClass.add(th,this.active.reverse ? this.reverseCls : this.sortedCls);
			
			//assign active.col to current
			this.active.col = th;
			
			//create value array
			var values = array.map(this.tbody.rows, function(row, i){
				return [row.cells[column].textContent, row, i];
			});
			
			//sort
			var multiplier = this.active.reverse ? -1 : 1;
			var sortFunction = "sort" in this.cols[column] ? 
				this.cols[column].sort : TableSorter.compareDefault;
			values.sort(function(a,b){
				var ret = sortFunction(a[0], b[0]) * multiplier;
				return ret !== 0 ? ret : (a[2] - b[2]); //stable sort hack
			});
			
			//detach tbody
			var tbodyTable = this.tbody.parentElement;
			tbodyTable.removeChild(this.tbody);
			
			array.forEach(values,function(value){
				this.tbody.appendChild(value[1]);
			},this);
			
			tbodyTable.insertBefore(this.tbody,tbodyTable.tBodies[0] || null);
			
			return true;
		},
		activate: function(){
			var self = this;
			on(this.thead,"th:click",function(){
				return self.sort(this);
			});
		}
	});
	
	TableSorter.compareDefault = function(a, b) {
		return a > b ? 1 : a < b ? -1 : 0;
	};
	TableSorter.compareNumeric = function(a, b) {
		return parseFloat(a) - parseFloat(b);
	};
	TableSorter.createReverseCompare = function(sortFunction) {
		return function(a, b) {
			return sortFunction(b, a);
		};
	};
	
	return TableSorter;
});