require([
  "dojo/dom-construct",
  "dojo/promise/all"
], function(domConstruct, all) {
  
  //filter all requests for POST requests with request content
  var requests = traffic.filter(function(flow){
    return flow.request.method === "POST" && flow.request.hasFormData;
  });
  
  console.log("Matched requests: "+requests.length+" of "+traffic.length);
  
  var data = {};			//Contains all POST data.
  var promises = []; 	//getFormData() returns a [dojo] promise.
  										//this array collects all promises to trigger the result
  										//output as soon as they are ready.
  
  //Iterate over all 
  _.each(requests,function(flow){
    promises.push(
      flow.request.getFormData().then(function(formData){
        if(!(flow.request.fullPath in data))
          data[flow.request.fullPath] = [];
        data[flow.request.fullPath].push(formData);
      })
    );
  });
  
  all(promises).then(function(){
    var pre = domConstruct.create("pre",{},outNode,"only");
    pre.innerText = JSON.stringify(data,null,"\t");    
  });
  
  
});