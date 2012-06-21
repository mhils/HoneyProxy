    // Set up splitpane with already existing DOM.
    var lhs = new goog.ui.Component();
    var rhs = new goog.ui.Component();

    // Set up splitpane with already existing DOM.
    var splitpane1 = new goog.ui.SplitPane(lhs, rhs,
        goog.ui.SplitPane.Orientation.HORIZONTAL);

    splitpane1.setInitialSize(800);
    splitpane1.setHandleSize(4);
    splitpane1.setContinuousResize(false);
    splitpane1.decorate(goog.dom.getElement('splitpane1'));
    splitpane1.setSize(new goog.math.Size(1200,500));
