/*
 * This report script summarizes all POSTed form data in a JSON array.
 * Great for a quick check to see whether there are any interesting POST requests in your data.
 */
require([
  "dojo/dom-construct",
  "dojo/promise/all"
], function(domConstruct, all) {
  
  //filter all requests for POST requests with form data
  var requests = traffic.filter(function(flow){
    return flow.request.method === "POST" && flow.request.hasFormData;
  });
  
  console.log("Matched requests: "+requests.length+" of "+traffic.length);
  if(requests.length === 0)
    return alert("No POST requests found!");
  
  var data = {};			//Collects all POST data.
  
  //Handles incoming formdata and adds it to the data obj.
  function handleFormData(flow, formData) {
    if(!(flow.request.fullPath in data))
      data[flow.request.fullPath] = [];
    
    var prettyData = {};
    for(var i=0; i<formData.length; i++){
      
      var name = formData[i].name;
      var value = formData[i].value;
      
      //if two or more form elements share the same name, collect all values in an array
      if (name in prettyData){
        if(Array.isArray(prettyData[name]))
          prettyData[name].push(value); //array present
        else
          prettyData[name] = [prettyData[name],value]; //single obj present
      } else {
        prettyData[name] = value; //not present
      }
      
    }
    data[flow.request.fullPath].push(prettyData);
  }
  
  //getFormData() and getContent() are  async,
  //they both return a dojo promise.
  //This array collects all promises to trigger the result
  //output as soon as they are ready.
  //Promises are covered in dojos Deferred tutorial.
  var promises = []; 	
  
  //For reach request, request its form data and push the returned promise into promises.
  _.each(requests,function(flow){
    var promise = flow.request.getFormData().then(handleFormData.bind(undefined, flow));
    promises.push(promise);
  });
  
  //dojo/promise/all() gets fulfilled when all passed promises are fulfilled.
  all(promises).then(function(){
    var pre = domConstruct.create("pre",{},outNode,"only");
    pre.innerText = JSON.stringify(data,null,"\t");    
  });
  
  
});