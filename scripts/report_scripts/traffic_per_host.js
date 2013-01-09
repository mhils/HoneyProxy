/*
 * This report scripts displays shows a traffic per hostname pie chart.
 */
require([
  "HoneyProxy/util/formatSize",
  "dojox/charting/Chart",
  "dojox/charting/themes/Claro",
  "dojox/charting/plot2d/Pie",
  "dojox/charting/action2d/Tooltip",
  "dojox/charting/action2d/MoveSlice",
  "dojox/charting/plot2d/Markers",
  "dojox/charting/axis2d/Default",
], function(formatSize, Chart, theme, Pie, Tooltip, MoveSlice) {
  
  // hostname -> propObj
  var trafficPerHost = {};
  
  // Iterate over all flows and sum up content lengths
  traffic.each(function(flow){
    var host = flow.request.host;
    if(!(host in trafficPerHost))
      trafficPerHost[host] = {y:0,text:"",count:0};
    var size = flow.request.contentLength + flow.response.contentLength;
    trafficPerHost[host]["y"] += size;
    trafficPerHost[host]["count"] += 1;
  });
  
  //create a Dojo Charting Array from the aggregated data.
  var data = [];
  for (host in trafficPerHost){
    trafficPerHost[host]["tooltip"] = trafficPerHost[host]["count"] + " requests";
    trafficPerHost[host]["text"] = host + " ("+formatSize(trafficPerHost[host]["y"])+")";
    data.push(trafficPerHost[host]);
  }
  
  // Create the chart within it's "holding" node
  var chart = new Chart(outNode,{
    title: "Traffic per host"
  });
  
  // Set the theme
  chart.setTheme(theme);
  
  // Add the only/default plot
  chart.addPlot("default", {
    type: Pie,
    markers: true,
    radius:200
  });
  
  // Add axes
  chart.addAxis("x");
  chart.addAxis("y", { vertical: true, fixLower: "major", fixUpper: "major"/*, max: 5000*/ });
  
  // Add the series of data
  chart.addSeries("Traffic",data);
  
  var tip = new Tooltip(chart,"default");
  
  // Create the slice mover
  var mag = new MoveSlice(chart,"default");
  
  // Render the chart!
  chart.render();
  
});