/*
 * This report script summarizes all POSTed form data.
 */
require([
  "dojo/dom-construct",
  "dojo/promise/all"
], function(domConstruct, all) {
  
  //filter all requests for POST requests with form data
  var requests = traffic.filter(function(flow){
    return flow.request.method === "POST" && flow.request.hasFormData;
  });
  
  if(requests.length === 0)
    return alert("No POST requests found!");
  
  console.log("Matched requests: "+requests.length+" of "+traffic.length);
  
  var data = {};			//Collects all POST data.
  
  //getFormData() and getContent() are  async,
  //they both return a dojo promise.
  //This array collects all promises to trigger the result
  //output as soon as they are ready.
  //Promises are covered in dojos Deferred tutorial.
  var promises = []; 	
  
  //Iterate over all matched requests
  _.each(requests,function(flow){
    var promise = 
        flow.request.getFormData().then(function(formData){
          if(!(flow.request.fullPath in data))
            data[flow.request.fullPath] = [];
          
          var prettyData = {}
          var double = false;
          for(var i=0;i<formData.length;i++){
            if (formData[i].name in prettyData){
              double = true;
              break;
            }
            prettyData[formData[i].name] = formData[i].value;
          }
          data[flow.request.fullPath].push(double ? formData : prettyData);
        });
    promises.push(promise);
  });
  
  all(promises).then(function(){
    var pre = domConstruct.create("pre",{},outNode,"only");
    pre.innerText = JSON.stringify(data,null,"\t");    
  });
  
  
});