/*
 * This report script checks for common security shortcomings on webapges
 */
require([
  "dojo/dom-construct"
], function(domConstruct) {
  
  //you can get the flow id by hovering over the leftmost 10px of the traffic table.
  var flow_id = 2;
  
  var flow = traffic.get(flow_id);
  
  if(!flow)
    return alert("Flow not found!");
  
  domConstruct.create("h2",{innerHTML:"Audit for "+_.escape(flow.request.fullPath)},outNode);
  domConstruct.create(
    "p",
    {
      innerHTML:
      "Please note that this audit checks for best practices, not for security holes. "+
      "A website can be fully secure with all headers absent. "+
    	"However, usually it's a good idea to limit the possible impact of security breaches in your page by specifying these headers."}, outNode);
  var result = {
    "Good": [],
    "Neutral": [],
    "Bad": []
  };
  var style = {
    "Good":"color: green",
    "Neutral":"",
    "Bad":"color: red"
  }
  
  function goodHeader(name, value) {
    result.Good.push("The page is served with a limiting <code>"+name+"</code> header: <code>"+_.escape(value)+"</code>"); 
  }
  function badHeader(name, suffix) {
    result.Bad.push("The page is not served with a <code>"+name+"</code> header" + (suffix || "."));
  }
  
  // X-Frame-Options Header
  var xFrameOptions = flow.response.getHeader(/X-Frame-Options/i);
  if(!xFrameOptions || !xFrameOptions.match(/Deny|SameOrigin|Allow-From/i)) {
    badHeader("X-Frame-Options"," and is vulnerable to clickjacking therefore.");
  } else {
    goodHeader("X-Frame-Options",xFrameOptions);
  }
  
  // Strict-Transport-Security Header
  var isSSL = (flow.request.scheme === "https");
  if(isSSL){
    
    var stt = flow.response.getHeader(/Strict-Transport-Security/i);
    if(!stt) {
      badHeader("Strict-Transport-Security"," and is vulnerable to man-in-the-middle attacks therefore.");
    } else if(!stt.match(/includeSubDomains/i)) {
      result.Neutral.push("The page is served with a limiting <code>Strict-Transport-Security</code> header. However, the header does not cover subdomains: <code>"+_.escape(stt)+"</code>"); 
    } else {
      goodHeader("Strict-Transport-Security",stt);
    }
    
  } else {
    result.Neutral.push("The page is not secured by SSL.");
  }
  
  // X-Content-Security-Policy
  var xCSP = flow.response.getHeader(/X-Content-Security-Policy/i);
  if(xCSP) {
    goodHeader("X-Content-Security-Policy",xCSP);
  } else {
    badHeader("X-Content-Security-Policy",". You should list all valid sources for scripts.");
  }

  // X-Content-Type-Options
  var xCTO = flow.response.getHeader(/X-Content-Type-Options/i);
  var CT = flow.response.getHeader(/Content-Type/i);
  if(!CT)
    badHeader("Content-Type",". Always specify a valid MIME type!");
  if(CT && xCTO && !!xCTO.match(/nosniff/i)) {
    goodHeader("X-Content-Type-Options",xCTO);
  } else {
    badHeader("X-Content-Type-Options",". This is a security feature that helps prevent attacks based on MIME-type confusion.");
  }
  
  // X-XSS-Protection
  var xXSSP = flow.response.getHeader(/X-XSS-Protection/i);
  if(xXSSP) {
    goodHeader("X-XSS-Protection",xXSSP);
  } else {
    badHeader("X-XSS-Protection",".");
  }
  
  //Output
  for(i in result){
    domConstruct.create("h3",{innerHTML:i, style: style[i]},outNode);
    var ul = domConstruct.create("ul",{},outNode);
    result[i].forEach(function(bp){
      domConstruct.create("li",{"innerHTML":bp},ul); 
    });
  }
  
  detailView.show(flow);
  
});