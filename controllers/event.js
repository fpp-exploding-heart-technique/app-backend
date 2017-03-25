const router = require('express').Router();

module.exports = (events) => {
    router.get('/initdb', (req, res) => {
      const data = [
        {
          "time":events.readTime( 1490427060000, 1490427062000),
          "loc":events.readLocation("41.105233, 29.028161"),
          "type":events.readType("kultur"),
          "desc":events.readDescription("müze falan gezek aağbi"),
          "owner":events.readOwner("burak0")
        },
        {
          "time":events.readTime( 1490427060000, 1490427062000),
          "loc":events.readLocation("41.105205, 29.026477"),
          "type":events.readType("kultur"),
          "desc":events.readDescription("müze falan gezek aağbi"),
          "owner":events.readOwner("burak1")
        },
        {
          "time":events.readTime( 1490427060000, 1490427062000),
          "loc":events.readLocation("41.104911, 29.024269"),
          "type":events.readType("kultur"),
          "desc":events.readDescription("müze falan gezek aağbi"),
          "owner":events.readOwner("burak2")
        }
      ];
      var r =data.map(x => events.createEvent(
        x.time, x.loc, x.desc, x.type, x.owner
      ));
      console.log(r);
      res.sendStatus(200);

    });

    // get event by id
    router.get('/:id', (req, res) => {
        events.findEventById(req.param.id, (err, data) => {
          if (err) {
            res.sendStatus(404);
          } else {
            console.log("found");console.log(data);
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
    //     type=["tarihi","kulturel","eglence"] bu temalardan herhangi
    //                                          birinde olan eventler
    // filter by owner:
    //               owner: burak   burakin eventleri
    // filter by location: find points in a radius
    //     loc=36,42  enlem,boylam cifti
    //     radius= 200  200 metre yaricapinda ara
    router.get('/', (req, res) => {
      events.findEvents(
        events.readTime(req.param("start"), req.param("end")),
        events.readTypes(req.param("type")),
        events.readOwner(req.param("owner")),
        events.readLocation(req.param("loc")),
        Number(req.param("radius")),
        (err, data) => {
        if (err) {
          console.error(err);
          res.sendStatus(404);
        } else {
          res.send(data);
        }
      });
    });

    // create event
    router.post('/', (req, res) => {
      var time  = events.readTime(req.body.start, req.body.end);
      var owner = events.readOwner(req.body.owner);
      var loc   = events.readLocation(req.body.loc);
      var type  = events.readType(req.body.type);
      var desc  = events.readDescription(req.body.desc);
      console.log("Create event:");
      console.log("    time  : ", time, req.body.start);
      console.log("    owner : ", owner);
      console.log("    loc   : ", loc);
      console.log("    type  : ", type);

      if ( time && type && owner && loc ) {
        events.createEvent(time, loc, desc, type, owner, (err, data) => {
          if (err) {
            console.error(err);
            res.sendStatus(400);
          }
          else res.send(data._id);

        });
      } else {
        res.sendStatus(400);
      }
    });

    // attendee request
    router.post('/attendReq', (req, res) => {
      events.attendRequest(req.body.eventId, req.body.userId, (err, data) => {
        if(err){
          res.sendStatus(400);
        } else {
          res.sendStatus(200);
        }
      });
    });

    // add attendee
    router.post('/addAttendee', (req, res) => {
      events.addAttendee(req.body.eventId, req.body.userId, (err, data) => {
        if(err){
          res.sendStatus(400);
        } else {
          res.sendStatus(200);
        }
      });
    });

    // update an event
    router.put('/', (req, res) => {
      var id    = events.readId(req.body.eventId);
      var time  = events.readTime(req.body.start, req.body.end);
      var owner = events.readOwner(req.body.owner);
      var loc   = events.readLocation(req.body.loc);
      var type  = events.readType(req.body.type);
      var desc  = events.readDescription(req.body.desc);
      console.log("Update event:");
      console.log("    id    : ", id);
      console.log("    time  : ", time);
      console.log("    owner : ", owner);
      console.log("    loc   : ", loc);
      console.log("    type  : ", type);
      console.log("    desc  : ", desc);

      events.updateEvent(id, time, loc, desc, type, owner, (err, data) =>{
        if(err){
          console.error(err);
          res.sendStatus(400);
        } else {
          res.send(data);
        }
      });


    });





    return router;
}
