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
        attendees: [{id: String, name: String}],
        requests: [{id: String, name: String}],
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
    };

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
    };

    const dropCollection = (callback) => {
      console.warn("Dropping collection: users");
      events.collection.drop(callback);
    }
    const findEventById = (eventId, callback) => {
      //events.findOne({_id: eventId}, callback);
      events.findById(eventId).lean().exec(callback);
    }
    const findEvents = (query,callback) => {
      events.find(query).lean().exec(callback);
    };


    const createEvent = (param, callback) => {
      var e = new events(param);
      e.save(callback);
    }

    const updateEvent = (eventId, change, callback) => {
      events.update({_id: eventId}, change, { upsert: false }, callback);
    }

    const attendRequest = (eventId, userId, userName, callback) => {
      console.log("Attend request: ", eventId, userId, userName);
      events.findOne({_id: eventId}, (err, data) => {
        if ( !data ) callback(err,data);
        else
          events.update(
            {_id: eventId},
            {$addToSet: {
              requests: {
                "id":userId,
                "name": userName
              }
            }},
            { upsert: false },
            callback
          );
      });
    }

    const addAttendee = (eventId, userId, userName, confirmed, callback) => {
      console.log("Add attendee: ", eventId, userId);
      var change = {$pull: {requests: {"id":userId}}};
      if(confirmed == "true")
        change.$addToSet = {attendees: {"id":userId, "name":userName }};
      events.update(
        {_id: eventId},
        change,
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


      dropCollection : dropCollection,
      findEventById : findEventById,
      findEvents    : findEvents,
      createEvent   : createEvent,
      updateEvent   : updateEvent,
      attendRequest : attendRequest,
      addAttendee   : addAttendee
    }
}
