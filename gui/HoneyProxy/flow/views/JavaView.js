define(["./BinaryView"], 
         function(BinaryView) {
           
  var JavaView = BinaryView.createSubclass([]);
  
  JavaView.className = "flow-java " + BinaryView.className;
  JavaView.resourceName = "Java Archive"
  JavaView.matches = JavaView.simpleMatcher(/application\/java-archive/i, /\.(jar|class)$/i);

  return JavaView;
});