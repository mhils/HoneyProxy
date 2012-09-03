/**
 * employ goog.ui.TableSorter to sort our main table.
 * TODO: Elaborate other solutions, we want to get rid 
 * of the closure library in the future as it's too big/bloated
 * for our needs.
 */
define(["dojo/domReady!"],function(){
	
	var trafficTableSorter = new goog.ui.TableSorter();
	trafficTableSorter.decorate(goog.dom.getElement('traffictable'));
	
	trafficTableSorter.setDefaultSortFunction(goog.ui.TableSorter.alphaSort);
	
	trafficTableSorter.setSortFunction(3, goog.ui.TableSorter.numericSort);
	trafficTableSorter.setSortFunction(5, goog.ui.TableSorter.createReverseSort(goog.ui.TableSorter.numericSort));
	
	HoneyProxy.trafficTableSorter = trafficTableSorter;
	
	/**
	 * Table Sorter Proxy - 
	 * proxy click events to the second table.
	 */
	$(".table-fixed-header .header th").click(function(){
		var index = $(this).index();
		$(".table-fixed-header .header th").removeClass();
		var toProxy = $($(".table-fixed-header .data th").get(index));
		toProxy.click();
		$(this).addClass(toProxy.attr('class'));
	});
	
});