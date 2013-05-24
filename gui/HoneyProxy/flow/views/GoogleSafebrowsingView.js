define(["./BinaryView"], 
         function(BinaryView) {
           
  var GoogleSafebrowsingView = BinaryView.createSubclass([]);
  
  GoogleSafebrowsingView.className = "flow-googlesafebrowsing " + BinaryView.className;
  GoogleSafebrowsingView.resourceName = "Google Safe Browsing Service";
  GoogleSafebrowsingView.matches = GoogleSafebrowsingView.simpleMatcher(/google\.safebrowsing/i);
  
  return GoogleSafebrowsingView;
});