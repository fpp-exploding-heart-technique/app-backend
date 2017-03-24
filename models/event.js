module.exports = (mongoose) => {
    var Schema = mongoose.Schema;

    const eventSchema  = new Schema({
        startTime: Date,
        endTime: Date,
        location: {type: [Number], index: '2dsphere'},
        description: String,
        attendees: [String],
        owner: String,
        type: String
    }, {collection: 'events'});

    const events = mongoose.model('Event', eventSchema);

    const getAllEvents = (start,end,/*loc,*/type,owner,callback) => {
      var query = {};
      if(start != undefined) query[startTime] = start;
      if(end   != undefined) query[endTime  ] = end;
      if(owner != undefined) query[owner]     = owner;
      if(type  != undefined) query[type]      = type;

      /*  if(loc   != undefined) {
      query[location ] = {
      $nearSphere: loc, $maxDistance: searchRadius
    };
  }*/
      events.find(query, callback);
    };

}
