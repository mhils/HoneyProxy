define(["./BinaryView"], 
         function(BinaryView) {
           
  var GoogleSafebrowsingView = BinaryView.createSubclass([]);
  
  GoogleSafebrowsingView.className = "flow-googlesafebrowsing " + BinaryView.className;
  GoogleSafebrowsingView.resourceName = "Google Safe Browsing Service";
  GoogleSafebrowsingView.matches = function(flow) {
    if (flow.response.contentType && !!flow.response.contentType.match(/google\.safebrowsing/i))
      return true;
    return false;
  };

  return GoogleSafebrowsingView;
});