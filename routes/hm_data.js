var mongoose = require('mongoose');
var BoothModel = mongoose.model('BoothModel');
exports.status = function(req, res){
  // Dump database to json
  BoothModel.find({},'booth votes -_id', function (err,docs){
    res.json(docs);
  });
};
