/*
 * This report script shows a request -> triggered request tree, e.g.
 * 
 *	example.com/index.html
 * 		style.css
 * 			imported.css
 * 		script.js
 * 
 * Please note that this script just searches for file name references.
 * In other words: It's just guessing and might create wrong subtrees.
 * Consider that when analyzing your data.
 */
require([ 
  "dojo/dom-construct",
  "dojo/promise/all",
  "dojo/request",
  "dojo/Deferred"
], function(domConstruct, all, request, Deferred) {

  if(traffic.length === 0)
    return alert("No requests found!");
  
  var attr = function(flow){ return flow.request.fullPath; }; //displayed text
  
  var i = 0,
      div = domConstruct.create("div",{},outNode,"only");
      tree = {},
      item = {},
      promises = {0:(new Deferred()).resolve()},
      lastIds = [],
      lastIdCount = 300;
    
  traffic.each(function(flow){
    var _i = ++i;
    var value = flow.request.filename.length < 5 ? flow.request.host : flow.request.filename;
    
    var promise = new Deferred();
    
    request.post("/api/search/",{
      data : {
        idsOnly: true,
        "in": JSON.stringify(lastIds),
        includeContent: true,
        filter: JSON.stringify([{
          field : "response.content",
          type : "contains", //or regexp
          value: value
        }])
      }
    }).then(function(result){
      //console.debug(flow.id + " waiting...");
      promises[_i-1].then(function(){
     		//console.warn(flow.id + " executing...");
        
        //console.log(result);
        result = JSON.parse(result);
        if(result.length == 0) {
          //console.log("Appending item "+flow.id+" as root");
          item[flow.id] = tree[attr(flow)] = {};
        }
        else {
          //console.log("Appending as child");
          item[flow.id] = item[result[0]][attr(flow)] = {};
        }
        
        div.textContent = Math.floor(10000*_i/traffic.length)/100+"%";
        
        promise.resolve(true);
      });
      
    });
    
    //add promise to dictionary
    promises[_i] = promise;
    
    //insert flow id
    lastIds.push(flow.id);
    if(lastIds.length > lastIdCount)
      lastIds.shift();
  });
  //wait for all promises to be finished
  all(promises).then(function(){
    var pre = domConstruct.create("pre",{},outNode,"only");
    pre.textContent = JSON.stringify(tree,null,"\t");    
  });
    
});