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
window.thisrequire = require;
require([ 
  "dojo/dom-construct",
  "dojo/promise/all",
  "dojo/request",
  "dojo/Deferred",
  "dojo/on"
], function(domConstruct, all, request, Deferred, on) {
 
  if(traffic.length === 0)
    return alert("No requests found!");
  
  var attrfunc = function(flow){ return flow.request.fullPath; }; //displayed text
  
  var i = 0,
      progressNode = domConstruct.create("div",{},outNode,"only"),
      tree = {}, // Master treeObj. flow.request.fullPath -> treeObj
      items = {}, // Contains all tree items. flow.id -> treeObj
      lastIds = [], //keeps all flow ids of previous requests (up to lastIdCount)
      lastIdCount = 300,
      promises = []; //collects all request promises. See post_extract.js for more details on this pattern
      
  
  traffic.each(function(flow){
    var _i = ++i;
    
    //initialize treeObj for this flow
    var item = items[flow.id] = {};
    
    //TODO: Enhance Search API with nested requests and do better filtering here.
    var value = flow.request.filename.length < 5 ? flow.request.host : flow.request.filename;
    var promise = request.post("/api/search/",{
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
      
      //console.log(result);
      result = JSON.parse(result);
      
      var parent  = (result.length == 0) ? tree : items[result[0]];
      var attr = "<span class=openDetail data-flow-id="+flow.id+">"+_.escape(attrfunc(flow))+"</span>";
      
      if(!(attr in parent)) {
        parent[attr] = item;
      } else {
        console.log("Duplicate request: Copy over subreqs",attr,parent[attr],item);
        for(var j in item) {
          parent[attr][j] = item[j];
        }
        items[flow.id] = parent[attr]; //replace own reference with the existing request so that new flows will end on the new one.
      }
      
      progressNode.textContent = Math.floor(10000*_i/traffic.length)/100+"%";
      
    });
    
    //add promise to dictionary
    promises.push(promise);
    
    //insert flow id
    lastIds.push(flow.id);
    if(lastIds.length > lastIdCount)
      lastIds.shift();
  });
  

  
  //wait for all promises to be finished
  all(promises).then(function(){
    var pre = domConstruct.create("pre",{},outNode,"only");
    pre.innerHTML = JSON.stringify(tree, undefined, "\t")
    .replace(/: {},?/g,""); //remove empty elements. comment this line to generate valid JSON
    on(pre, ".openDetail:click",function(){
      detailView.show(traffic.get(parseInt(this.dataset.flowId)));
    });
  });
  
  window.debug = {tree: tree, item: items};
  
});