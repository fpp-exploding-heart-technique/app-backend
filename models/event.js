module.exports = (mongoose) => {
    var Schema = mongoose.Schema;

    const eventSchema  = new Schema({
        start: Number,
        end: Number,
        location: {
          type: {type:String},
          //'index' : '2dsphere',
          coordinates: {
            'type' : [Number],
            'required' : true
          }
        },
        description: String,
        attendees: [String],
        owner: String,
        type: String
    }, {collection: 'events'});

    const events = mongoose.model('Event', eventSchema);

    // valid reading
    const readTime = (start, end) => {
      try {
        start = Date.parse(start);
        end = Date.parse(end);
        if(isNaN(start) || isNaN(end)) return null;
        console.log({start:start, end:end});
        return {start:start, end:end};
      } catch(err) {
        console.error(err.message);
        return null;
      }
    }
    const readLocation = (loc) => {
      if(loc){
        loc = loc.split(',');
        if( loc.length != 2) return false;
        try{
          loc = loc.map(Number);

          return loc;
        } catch(err) { // type error
          console.error(err.message);
          return null;
        }
      } else
        return null;
    }

    const readArr = (reader) => {
      return (arrStr) => {
        var arr;
        try {
          arr = JSON.parse(arrStr);
        } catch(err) {
          console.error(err, arr);
          return null;
        }
        arr = arr.map(reader);
        if(null in arr) return null;
        return arr;
      };
    }

    const findEventById = (id, callback) => {
      events.findOne({id_: id}, callback);
      //events.findById(id, callback);
    }
    const findEvents = (time,type,owner,loc,radius,callback) => {
      console.log("Get events:");
      console.log("    time   : ", time);
      console.log("    owner  : ", owner);
      console.log("    type   : ", type);
      console.log("    loc    : ", loc);
      console.log("    radius : ", radius);

      var query = {};
      if( time ){
        query["start"] = {$lt : time.end};
        query["end"  ] = {$gt : time.start};
      }
      if( owner ) query["owner"] = owner;
      if( type  ) query["type"]  = {$in: type};
      console.log(query);
      if(loc != undefined ) {
        radius = radius ? radius : 1000;
        query["location" ] = {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: loc
            },
            $maxDistance: radius
          }
        };
      }
      events.find(query, callback);
    };


    const createEvent = (time_, loc_, desc_, type_, owner_, callback) => {
      var e = new events({
        end: time_.end,
        start: time_.start,
        location: {type:"Point", coordinates:loc_},
        description: desc_,
        attendees: [],
        owner: owner_,
        type: type_
      });

      e.save(callback);

    }

    const updateEvent = (id, time_, loc_, desc_, type_, owner_, callback) => {
      var setFields = {};
      if( time_  ) {
        setFields["start"]  = time_.start;
        setFields["end"]    = time_.end;
      }
      if( owner_ ) setFields["owner"] = owner_;
      if( type_  ) setFields["type"]  = type_;
      events.update({id_: id}, {$set: setFields}, callback);console.log("asd");
    }

    return {
      readTime        : readTime,
      readLocation    : readLocation,
      readOwner       : (str) => str ? str : null,
      readType        : (str) => str ? str : null,
      readTypes       : readArr((str) => str ? str : null), //
      readDescription : (str) => str ? str : null,
      readId          : (str) => str ? str : null,

      findEventById: findEventById,
      findEvents: findEvents,
      createEvent: createEvent,
      updateEvent: updateEvent
    }
}
