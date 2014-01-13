var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
  
/**
* Schema
*/
// TODO: expiration on read functionality
var BoothSchema = Schema({
  booth: String,
  votes: Number,
  pres_total: Number,
  cont_total: Number
});

mongoose.model('BoothModel', BoothSchema);
