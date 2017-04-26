var mongoose = require('mongoose');
var schema= mongoose.Schema;
var BookingDetailsSchema = new schema({
  BookingType: String,
  Area : String,
  Tower:String,
  Floor:String,
  Wing:String,
  Zone:[{operations:[ {"O-01": { "allocated":0,bookingStartTime:String,bookingStartTime:String }   },
                      {"O-02": { "allocated":0,bookingStartTime:String,bookingStartTime:String }   },
                      {"O-03": { "allocated":0,bookingStartTime:String,bookingStartTime:String }   },
                      {"O-04": { "allocated":0,bookingStartTime:String,bookingStartTime:String }   },
                      {"O-05": { "allocated":0,bookingStartTime:String,bookingStartTime:String }   }
                    ] },
        {Sales     :[ {"S-01": { "allocated":0,bookingStartTime:String,bookingStartTime:String }   },
                      {"S-02": { "allocated":0,bookingStartTime:String,bookingStartTime:String }   },
                      {"S-03": { "allocated":0,bookingStartTime:String,bookingStartTime:String }   },
                      {"S-04": { "allocated":0,bookingStartTime:String,bookingStartTime:String }   },
                      {"S-05": { "allocated":0,bookingStartTime:String,bookingStartTime:String }   }
                  ] },
        {Delivery  :[ {"D-01": { "allocated":0,bookingStartTime:String,bookingStartTime:String }   },
                      {"D-02": { "allocated":0,bookingStartTime:String,bookingStartTime:String }   },
                      {"D-03": { "allocated":0,bookingStartTime:String,bookingStartTime:String }   },
                      {"D-04": { "allocated":0,bookingStartTime:String,bookingStartTime:String }   },
                      {"D-05": { "allocated":0,bookingStartTime:String,bookingStartTime:String }   }
                    ] },
        { HR       :[ {"HR-01": { "allocated":0,bookingStartTime:String,bookingStartTime:String }   },
                      {"HR-02": { "allocated":0,bookingStartTime:String,bookingStartTime:String }   },
                      {"HR-03": { "allocated":0,bookingStartTime:String,bookingStartTime:String }   },
                      {"HR-04": { "allocated":0,bookingStartTime:String,bookingStartTime:String }   },
                      {"HR-05": { "allocated":0,bookingStartTime:String,bookingStartTime:String }   }
                    ] },
        {Finance   :[ {"F-01": { "allocated":0,bookingStartTime:String,bookingStartTime:String }   },
                      {"F-02": { "allocated":0,bookingStartTime:String,bookingStartTime:String }   },
                      {"F-03": { "allocated":0,bookingStartTime:String,bookingStartTime:String }   },
                      {"F-04": { "allocated":0,bookingStartTime:String,bookingStartTime:String }   },
                      {"F-05": { "allocated":0,bookingStartTime:String,bookingStartTime:String }   }
                    ] },



  Room:String,
  BookingDate:String,
  StartTime:String,
  EndTime:String,
  SeatNumber:String
});

var bookingDetailsModel = mongoose.model('bookingDetails',BookingDetailsSchema,'bookingDetailsCollection');

module.exports =   //-----export---;
