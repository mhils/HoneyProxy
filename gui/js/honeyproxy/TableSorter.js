var trafficTableSorter = new goog.ui.TableSorter();
trafficTableSorter.decorate(goog.dom.getElement('traffictable'));

trafficTableSorter.setDefaultSortFunction(goog.ui.TableSorter.alphaSort);

trafficTableSorter.setSortFunction(3, goog.ui.TableSorter.numericSort);
//trafficTableSorter.setSortFunction(5, goog.ui.TableSorter.numericSort);
trafficTableSorter.setSortFunction(5, goog.ui.TableSorter.createReverseSort(goog.ui.TableSorter.numericSort));
