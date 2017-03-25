module.exports = (mongoose) => {
    var Schema = mongoose.Schema;

    const eventSchema  = new Schema({
        time: { start: Number, end: Number},
        location: {
          type: [Number],
          index: '2dsphere'
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
    const readOwner = (str) => {
      if(str){
        return str;
      } else
        return null;
    }
    const readType = (str) => {
      if(str){
        return str;
      } else
        return null;
    }
    const readDescription = (str) => {
      if(str){
        return str;
      } else
        return null;
    }

    const findEventById = (id, callback) => {
      events.findById(id, callback);
    }
    const findEvents = (time,/*loc,*/type,owner,callback) => {
      console.log("Get events:");
      console.log("    time  : ", time);
      console.log("    owner : ", owner);
      //console.log("    loc: ", loc);
      console.log("    type  : ", type);

      var query = {};
      if( time ){
        query["time"] = {
          $not: {
            $or: [
              {end  : {$lte: time.start}},
              {start: {$gte: time.end}}
            ]
          }
        }
      }
      if( owner ) query["owner"] = owner;
      if( type  ) query["type"]  = type;
      console.log(query);
      /*  if(loc   != undefined) {
        query["location" ] = {
          $nearSphere: loc, $maxDistance: searchRadius
        };
      }*/
      events.find(query, callback);
    };

    const createEvent = (time_, loc_, desc_, type_, owner_, callback) => {
      var e = new events({
        time: time_,
        location: loc_,
        description: desc_,
        attendees: [],
        owner: owner_,
        type: type_
      });

      e.save(callback);

    }
    return {
      readTime: readTime,
      readLocation: readLocation,
      readOwner: readOwner,
      readType: readType,
      readDescription: readDescription,

      findEventById: findEventById,
      findEvents: findEvents,
      createEvent: createEvent,

    }
}
