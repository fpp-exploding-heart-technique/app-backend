const router = require('express').Router();

module.exports = (events) => {
    // initialize database with dummy data
    router.get('/initdb', (req, res) => {
      const data = [
        {
          attendees: [], requests: [],
          title       : events.readTitle("Event 1"),
          start       : 1490427060000,
          end         : 1490427062000,
          location    : events.readLocation("41.105233, 29.028161"),
          type        : events.readType("Doğa"),
          description : events.readDescription("kamp"),
          owner       : events.readOwner("burak0")
        },
        {
          attendees: [], requests: [],
          title       : events.readTitle("Event 2"),
          start       : 1490427060000,
          end         : 1490427062000,
          location    : events.readLocation("41.105205, 29.026477"),
          type        : events.readType("Spor"),
          description : events.readDescription("basalım, bench basalım"),
          owner       : events.readOwner("burak1")
        },
        {
          attendees: [], requests: [],
          title       : events.readTitle("Event 3"),
          start       : 1490427060000,
          end         : 1490427062000,
          location    : events.readLocation("41.104911, 29.024269"),
          type        : events.readType("Kültür"),
          description : events.readDescription("müze falan gezek aağbi"),
          owner       : events.readOwner("burak2")
        }
      ];
      var r = 0;
      data.map(x => events.createEvent(
        x, (err,data)=>{console.log(x,err);}
      ));
      console.log(r);
      res.sendStatus(200);

    });

    // get event by id
    router.get('/:id', (req, res) => {
        console.log(req.params.id);
        events.findEventById(req.params.id, (err, data) => {
          if (err) {
            res.sendStatus(404);
          } else {
            data.location = data.location.coordinates[0]+","+
                            data.location.coordinates[1];
            console.log(data.location);
            res.send(data);
          }
        });

    });

    // get events, maybe filtered
    // filter by time: find events that intersects with given time interval
    //     start= 1490427060000 timestamp
    //     end =  1490427062000
    //
    // filter by type: give list of appropriate types
    //     type=["tarihi","kulturel","eglence"] events that has one of these types
    // filter by owner:
    //               owner: burak   events created by "burak"
    // filter by location: find points in a radius
    //     loc=36,42     lat,lon pair in a string
    //     radius= 200   search in 200 meters
    router.get('/', (req, res) => {
      // build the query
      var query = {};
      var t;
      if(t = events.readTime(req.param("start", req.param("end")))) {
        query.start = {$lt : t.end};
        query.end   = {$gt : t.start};
      }
      if(t = events.readOwner(req.param("owner")))
        query.owner = t;
      if(t = events.readLocation(req.param("loc"))) {
        var r = Number(req.param("radius"));
        query.location = {
          $near: {
            $geometry: loc,
            $maxDistance: (r ? r : 1000)
          }
        };
      }
      if(t = events.readType(req.param("type")))
        query.type = {$in: t};

      // execute
      events.findEvents(query, (err, data) => {
        if (err) {
          console.error(err);
          res.status(500);
          res.send({message: "What can heroku do sometimes"});
        } else {
          res.send(data.map(x => {
            delete x.attendees; delete x.requests;
            x.location = String(x.location.coordinates[0])+","+
                         String(x.location.coordinates[1]);
            return x;
          }));
        }
      });
    });

    /* create event
          start: <timestamp>
          end: <timestamp>
          owner: <string>
          location: "<lat>,<lon>"
          type: <string>
          description: <string>
    */
    router.post('/', (req, res) => {
      // build the object
      var e = {attendees : [], requests: []};
      var t;
      e.title = events.readTitle(req.body.title);
      if(t = events.readTime(req.body.start, req.body.end)) {
        e.start = t.start;
        e.end   = t.end;
      }
      e.owner       = events.readOwner(req.body.owner);
      e.location    = events.readLocation(req.body.loc);
      e.type        = events.readType(req.body.type);
      e.description = events.readDescription(req.body.desc);
      console.log("Create: ", e);
      // save if everything is OK
      if ( e.description && e.title && e.start && e.end &&
           e.type && e.owner && e.location
      ) {
        events.createEvent(e, (err, data) => {
          if (err) {
            console.error(err);
            res.status(500);
            res.send({message: "What can heroku do sometimes"});
          }
          else res.send(data._id);
        });
      } else {
        res.status(400);
        res.send({message: "Some arguments are missing or invalid"});
      }
    });

    /* add attendee request to specified event

    */
    router.post('/attendReq', (req, res) => {
      events.attendRequest(req.body.eventId, req.body.userId, (err, data) => {
        if(err){
          res.status(404);
          res.send({message: "Event could not found"});
        } else {
          res.send({message: "Request is added"});
        }
      });
    });

    // reject a request or add attendee
    // if confirmed is true, add attendee otherwise reject the request
    router.post('/addAttendee', (req, res) => {
      events.addAttendee(req.body.eventId, req.body.userId, req.body.confirmed, (err, data) => {
        if(err){
          res.status(404);
          res.send({message: "Event could not found"});
        } else {
          res.send({message: "Attendee is added"});
        }
      });
    });

    // update an event
    router.put('/', (req, res) => {
      var id;
      if(!(id = events.readId(req.body.eventId))){
        res.status(400);
        res.send({message:"eventId is missing"});
      }
      else {
        var change = {};
        var t;
        if(t = events.readTitle(req.body.title))      change.title = t;
        if(t = events.readTime(req.body.start, req.body.end)) {
          change.start = t.start;
          change.end   = t.end;
        }
        if(t = events.readOwner(req.body.owner))      change.owner    = t;
        if(t = events.readType(req.body.type))        change.type     = t;
        if(t = events.readDescription(req.body.desc)) change.description = t;
        console.log(change.start, change.end);
        events.updateEvent(id, change, (err, data) =>{
          if(err){
            console.error(err);
            res.status(400);
            res.send(err);
          } else {
            res.send(data);
          }
        });
      }
    });
    return router;
}
