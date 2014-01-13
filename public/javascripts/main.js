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
    config.element = "pavilion";
    config.radius = cfg.radius || 20;
    config.visible = true;
    config.opacity = 40;
    if(cfg.gradient)
      config.gradient = cfg.gradient;
    //config.gradient={.9:"#cc0000",.8:"#ff0000",.7:"#ff9900",.6:"#ffff00",.5:"#66ff00",.4:"#006600",.3:"#00ccff",.2:"#0000cc",.1:"#999999"};
    config.gradient={.9:"#cc0000",.6:"#ffff00",.3:"#00ccff"};
    app.coordinates = app.LAYOUTS[cfg.layout || "main"];
    var heatmap = h337.create(config);
    app.pavilion_heatmap = heatmap;
    config.element = "stage";
    heatmap = h337.create(config);
    app.stage_heatmap = heatmap;
  };
  app.init();
  //var typeField = document.getElementById("typefield");
  var repaint = function(incomingdata){
    //incomingdata = randomdata(pavilion_coords).concat(randomdata(stage_coords));
    var stage_data = [];
    var pavilion_data = [];
    var stage_max = 80;
    var pavilion_max = 80;
    for(var idi=0; idi<incomingdata.length; idi++){
      var boothid = incomingdata[idi].booth;
      var booth;
      if (boothid in pavilion_coords){
	booth = pavilion_coords[boothid];
      } else if (boothid in stage_coords){
	booth = stage_coords[boothid];
      } else {
	console.log('Invalid booth id: '+boothid);
      }
      // TODO: Verify data coming in is good
      var val = incomingdata[idi].votes;
      // TODO: Save time by putting this into def file
      var x=parseInt(booth.x)+parseInt(booth.w)/2;
      var y=parseInt(booth.y)-575+parseInt(booth.h)/2;
      if (boothid in pavilion_coords){
	pavilion_data.push({x: x, y: y, count: val});
	if(val > pavilion_max)
	  pavilion_max = val;
      } else if (boothid in stage_coords){
	stage_data.push({x: x, y: y, count: val});
	if(val > stage_max)
	  stage_max = val;
      } 
    }
    app.pavilion_heatmap.store.setDataSet({max: pavilion_max, data: pavilion_data});
    app.stage_heatmap.store.setDataSet({max: stage_max, data: stage_data});
  }
  var randomdata = function(dataset) {
    // Return random heatmap data for each item
    var rdat=[];
    for (var booth in dataset){
      rdat.push({booth:booth, votes:Math.random()*100});
    }
    return rdat;
  }

  $("#one").on('click', function(){
    $("#stage").hide();
    $("#pavilion").show();
    $("#two").addClass("notshown");
    $("#one").removeClass("notshown");
  });
  $("#two").on('click', function(){
    $("#pavilion").hide();
    $("#stage").show();
    $("#one").addClass("notshown");
    $("#two").removeClass("notshown");
  });
  $("#stage").hide();
  var do_update = function(){
    // Loads initial data and calls repaint() on load of data
    $.ajax({url:'status',dataType:'json'}).done(function(incomingdata){
      //console.log('received');
      //console.log(incomingdata);
      repaint(incomingdata);
      setTimeout(do_update,10000);
    }).fail(function(){console.log('Failure in pulling data');});
  }
      
    
  do_update();

};
