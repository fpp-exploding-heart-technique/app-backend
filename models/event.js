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
        title: String,
        description: String,
        attendees: [String],
        requests: [String],
        owner: String,
        type: String
    }, {collection: 'events'});

    const events = mongoose.model('Event', eventSchema);

    // valid reading
    const event_types = [
      "Eğlence",
      "Tarih",
      "Kültür",
      "Sanat",
      "Spor",
      "Doğa"
    ];
    const description_limit = 1500;
    const title_limit = 50;
    const readLocation = (loc) => {
      if(loc){
        loc = loc.split(',');
        if( loc.length != 2) return false;
        try{
          loc = loc.map(Number);

          return {type:"Point", coordinates:loc};
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

    const findEventById = (eventId, callback) => {
      //events.findOne({_id: eventId}, callback);
      events.findById(eventId, callback);
    }
    const findEvents = (query,callback) => {
      console.log(query);
      events.find(query, callback);
    };


    const createEvent = (param, callback) => {
      var e = new events(param);
      e.save(callback);
    }

    const updateEvent = (eventId, change, callback) => {
      events.update({_id: eventId}, change, { upsert: false }, callback);
    }

    const attendRequest = (eventId, userId, callback) => {
      console.log("Attend request: ", eventId, userId);
      events.find({_id: eventId}, (err, data)=>console.log(data));
      events.update(
        {_id: eventId},
        {$addToSet: {requests: userId}},
        { upsert: false },
        callback
      );
    }

    const addAttendee = (eventId, userId, callback) => {
      console.log("Add attendee: ", eventId, userId);
      events.update(
        {_id: eventId},
        {$pull: {requests: userId}, $addToSet: {attendees: userId}},
        { upsert: false },
        callback
      );
    }
    return {
      // Haskell'ciye node.js yazdiran getir mutlu mu simdi :(
      readTitle       : str => str && str.length < title_limit ? str : null,
      readTime        : (start, end) => {
                          var t = {"start":Number(start), "end":Number(end)};
                          return (t.start && t.end)?t:null;
                        }, // read timestamp
      readLocation    : readLocation,
      readOwner       : str => str ? str : null,
      readType        : str => event_types.indexOf(str)>-1 ? str : null, // valid type name
      readTypes       : readArr((str) => str ? str : null), //
      readDescription : str => str && str.length < description_limit ? str : null,
      readId          : str => str ? str : null,

      findEventById : findEventById,
      findEvents    : findEvents,
      createEvent   : createEvent,
      updateEvent   : updateEvent,
      attendRequest : attendRequest,
      addAttendee   : addAttendee
    }
}
