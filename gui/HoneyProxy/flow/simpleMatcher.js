define([],function(){
  
  //Simple matching function generator for View.matches(flow) that performs a match based on the supplied content type and filename.
  
  return function(contentType, filename){
    return function(flow) {
      if (contentType && flow.response.contentType && !!flow.response.contentType.match(contentType))
        return true;
      else if (filename && flow.request.filename && !!flow.request.filename.match(filename))
        return true;
      return false;
    };
  };
})