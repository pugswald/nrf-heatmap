var app = {};
app.config = {
  exclude: true
};
app.LAYOUTS ={"pavilion":{"coords":pavilion_coords,"img":"images/pavilion.png"},
	      "stage":{"coords":stage_coords,"img":"images/stage.png"}
};

window.onload = function(){
  app.init = function initialize(){
    var cfg = arguments[0] || {};
    var config = {};
    config.element = "floorplan";
    config.radius = cfg.radius || 20;
    config.visible = true;
    config.opacity = 40;
    if(cfg.gradient)
      config.gradient = cfg.gradient;
    config.gradient={.9:"#cc0000",.8:"#ff0000",.7:"#ff9900",.6:"#ffff00",.5:"#66ff00",.4:"#006600",.3:"#00ccff",.2:"#0000cc",.1:"#999999"}
    app.coordinates = app.LAYOUTS[cfg.layout || "main"];
    if(cfg.layout)
      $("floorplan").style.backgroundImage = cfg.layout.img;
    var heatmap = h337.create(config);
    app.heatmap = heatmap;
  };
  app.init();
  //var typeField = document.getElementById("typefield");
var repaint = function(){
  // generate data object
  var data = [];
  var incomingdata = randomdata(pavilion_coords);
  var max = 0;
  var minx=9999;
  var miny=9999;
  var maxx=0;
  var maxy=0;
  //temp = {},
  //text = typeField.value,
  //tlen = text.length,
  //coordinates = app.coordinates;
  var coordinates=pavilion_coords;
  for(var boothid in incomingdata){
    var booth = coordinates[boothid];
    // TODO: Verify data coming in is good
    var val = incomingdata[boothid];
    var x=parseInt(booth.x)+parseInt(booth.w)/2;
    var y=parseInt(booth.y)-575+parseInt(booth.h)/2;
    data.push({x: x, y: y, count: val});
    if(val > max)
      max = val;
    if (y>maxy) maxy=y;
    if (y<miny) miny=y;
    if (x>maxx) maxx=x;
    if (x<minx) minx=x;
  }
  console.log('Bounding rectangle '+minx+','+miny+' to '+maxx+','+maxy);
  app.heatmap.store.setDataSet({max: max, data: data});
}
var randomdata = function(dataset) {
  // Return random heatmap data for each item
  var rdat={};
  for (var booth in dataset){
    rdat[booth]=Math.random()*100;
  }
  return rdat;
}
/*
var len = typeField.value.length;
typeField.onkeypress = function(e){
  // ignore cursor IE hack
  if(e.charCode == 0 && [37, 38, 39, 40].indexOf(e.keyCode) > -1)
    return;
  var key = String.fromCharCode(e.charCode || e.keyCode);
  if(/^[A-Za-z]$/.test(key)){
    key = key.toUpperCase();
  }
  if(app.config.exclude && app.EXCLUDES.indexOf(key) == -1){
    var coord = app.coordinates[key]
    coord && app.heatmap.store.addDataPoint.apply(app.heatmap.store,coord);
  }
};

typeField.onkeyup = function(e){
  if(Math.abs(len-this.value.length) > 1 || e.keyCode == 8){
    repaint();
  }
  len = this.value.length;
};
*/
var items = document.getElementsByTagName("li");
for(var i=0; i < items.length; i++){
  (function(i){
    items[i].onclick = function(){
      typeField.value = app.SAMPLE_TEXT[i];
      repaint();
    };
  })(i);
}
var $ = function(id){
  return document.getElementById(id);
};
var gradients = [
{ 0.45: "rgb(0,0,255)", 0.55: "rgb(0,255,255)", 0.65: "rgb(0,255,0)", 0.95: "yellow", 1.0: "rgb(255,0,0)"},
{ 0.45: "rgb(255,255,255)", 0.70: "rgb(0,0,0)",0.9: "rgb(2,255,246)", 1.0: "rgb(3,34,66)"},
{ 0.45: "rgb(216,136,211)", 0.55: "rgb(0,255,255)", 0.65: "rgb(233,59,233)", 0.95: "rgb(255,0,240)", 1.0: "yellow"}
];
/*
$("apply").onclick = function(){
  var cfg = {};
  cfg.radius = Math.pow(10,$("fingertip").selectedIndex) +40;
  cfg.gradient = gradients[$("gradient").selectedIndex];
  cfg.layout = $("layout").value;
  app.heatmap.cleanup();
  app.init(cfg);
  repaint();
}
*/
repaint();
};
