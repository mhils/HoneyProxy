/**
 * employ goog.ui.TableSorter to sort our main table.
 * TODO: Elaborate other solutions, we want to get rid 
 * of the closure library in the future as it's too big/bloated
 * for our needs.
 */
(function(){
	
	var trafficTableSorter = new goog.ui.TableSorter();
	trafficTableSorter.decorate(goog.dom.getElement('traffictable'));
	
	trafficTableSorter.setDefaultSortFunction(goog.ui.TableSorter.alphaSort);
	
	trafficTableSorter.setSortFunction(3, goog.ui.TableSorter.numericSort);
	trafficTableSorter.setSortFunction(5, goog.ui.TableSorter.createReverseSort(goog.ui.TableSorter.numericSort));
	
	HoneyProxy.trafficTableSorter = trafficTableSorter;
})();