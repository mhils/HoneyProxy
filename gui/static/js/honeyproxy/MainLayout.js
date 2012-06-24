(function(){
	/**
	 * Rudimentary SplitPane Resizer - resizes a goog.ui.SplitPane based on browser resize events.
	 * Can toggle the visibility of the second panel. (that's what it's made for)
	 */
	SplitPaneResizer = function SplitPaneResizer(splitpane,sizeFunc){
		this._splitpane = splitpane;
		this._widthOnOpen = 600;
		this._sizeFunc = sizeFunc;
		this.vsm = new goog.dom.ViewportSizeMonitor();
		goog.events.listen(this.vsm, goog.events.EventType.RESIZE, this.onResize.bind(this));
	}
	SplitPaneResizer.prototype.getSize = function(){
		this._size = this._size || goog.style.getBorderBoxSize(this._splitpane.getContentElement());
		return this._size;
	}
	SplitPaneResizer.prototype.onResize = function(){
		var newSize = this._sizeFunc(this._splitpane);
		
		//calculate size of the first component
		var secondWidth = this.getSize().width - this._splitpane.getFirstComponentSize();
		if(secondWidth <= 0)
			this._splitpane.setFirstComponentSize(newSize.width);
		else if(this._splitpane.getFirstComponentSize() + 50 >  newSize.width)
			this._splitpane.setFirstComponentSize(
					Math.floor(this._splitpane.getFirstComponentSize() * 
					(newSize.width / this.getSize().width)) 
				);
				
		this._splitpane.setSize(newSize);
		this._size = newSize;
	}
	SplitPaneResizer.prototype.openSecond = function(){
		this._splitpane.setFirstComponentSize(this._widthOnOpen);
	};
	SplitPaneResizer.prototype.closeSecond = function(){
		this._splitpane.setFirstComponentSize(this.getSize().width);
	};
	
	
	
	var main = $('#main')[0];
	var header = $("header")[0];
	var footer = $("footer")[0];
	
	// Set up splitpane with already existing DOM.
	var lhs = new goog.ui.Component();
	var rhs = new goog.ui.Component();
	
	var splitpane = new goog.ui.SplitPane(lhs, rhs,
	    goog.ui.SplitPane.Orientation.HORIZONTAL);
	
	
	var getDesiredMainPanelSize = function() {
			var viewport = goog.dom.getViewportSize();
			var height = viewport.height;
			height -= goog.style.getSize(header).height;
			height -= goog.style.getSize(footer).height;
			return new goog.math.Size(viewport.width,height);
	}
	
	
	var size = getDesiredMainPanelSize();
	splitpane.setInitialSize(size.width); //equiv to closeSecond, but the Resizer doesn't have access to the DOM here.
	splitpane.setHandleSize(4);
	splitpane.setContinuousResize(false);
	splitpane.decorate(main);
	
	splitpane.setSize(size);
	
	
	
	
	HoneyProxy.MainLayout = {
		splitpaneResizer: new SplitPaneResizer(splitpane,getDesiredMainPanelSize)
	};
		
})();