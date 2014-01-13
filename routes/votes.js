/*
 * GET voter submissions page.
 */
var apikey="UPdm8V5TWUXTXjFCnA4H"
var valid_data=["Please enter booth number", "Overall Presentation","Booth Content"]; // ORDER IMPORTANT
var mongoose = require('mongoose');
var BoothModel = mongoose.model('BoothModel');
exports.getvotes = function(req, res){
  res.render('votes', { title: 'Vote submissions', errors: "" });
};

var createOrUpdateBooth = function(clean_vote) {
  BoothModel.findOne({booth:clean_vote[0]}, function(err,booth){
    console.log('cv0 is '+ clean_vote[0] );
    if (err){
      errors.push('Server problem - check logs');
      console.log(msgs);
    } else {
      if (booth){
	//console.log('Modify existing booth');
	BoothModel.update({booth:clean_vote[0]},{$inc:{ votes: 1, pres_total:clean_vote[1], cont_total: clean_vote[2]}}).exec();
      } else {
	//console.log('Create new booth '+clean_vote[0]);
	var newBooth = new BoothModel({booth:clean_vote[0], votes: 1, pres_total: clean_vote[1], cont_total: clean_vote[2]});
	newBooth.save();
      } 
      //console.log('Vote for booth '+clean_vote[0]+': '+clean_vote[1]+","+clean_vote[2]);
    }
  });
};
  
  
  

exports.postvotes = function(req, res){
  var errors = Array();
  var good_votes=0;
  if (!req.body.apikey){
    errors.push("API Key missing");
  } else if (req.body.apikey != apikey) {
      errors.push("API Key invalid");
  } else {
    // Process vote submissions
    try {
      var votes=JSON.parse(req.body.votes);
      for (var vi=0; vi< votes.length; vi++){
	var vote=votes[vi];
	var clean_vote=[]; // Final array should be booth, pres, cont
	// Data validation
	for (var di=0; di< valid_data.length; di++){
	  var data_name=valid_data[di]
	  if (data_name in vote) {
	    var n = vote[data_name];
	    if (typeof n === 'number' && n % 1 == 0) {
	      // Valid
	      clean_vote.push(n);
	    } else {
	      errors.push("Bad vote num "+vi+" '"+data_name+"' not an integer: "+n);
	    }
	  } else {
	    errors.push("Bad vote num "+vi+" missing "+data_name);
	  }
	}
	if (clean_vote.length == 3){
	// Write to database
	  for (var cvi=1;cvi<3;cvi++){
	    if (clean_vote[cvi] > 5) clean_vote[cvi] = 5;
	    if (clean_vote[cvi] < 0) clean_vote[cvi] = 0;
	  }
	  createOrUpdateBooth(clean_vote);
	  good_votes+=1;
	}
      }
    } catch (e) {
      errors.push("Invalid Vote data: "+e.message);
    }
  }
  res.render('votes', { title: 'Vote submissions', errors: errors, votes_processed:good_votes });
};
