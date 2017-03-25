const router = require('express').Router();

module.exports = (events) => {

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
    router.get('/', (req, res) => {
      console.log(req.param);
      events.findEvents(
        events.readTime(req.param("start"), req.param("end")),
        //req.param.loc,
        events.readTypes(req.param("type")),
        req.param("owner"),
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
      /* TODO
        simdi hamza kardes. ben sadece burda var mı yok mu diye baktim,
        sen date tipine gore bi valide edersin buncaazları.
      */
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

    // update an event
    router.post('/:id', (req, res) => {
      var id    = events.readId(req.param.id);
      var time  = events.readTime(req.body.start, req.body.end);
      var owner = events.readOwner(req.body.owner);
      var loc   = events.readLocation(req.body.loc);
      var type  = events.readType(req.body.type);
      var desc  = events.readDescription(req.body.desc);
      console.log("Update event:");
      console.log("    time  : ", time, req.body.start);
      console.log("    owner : ", owner);
      console.log("    loc   : ", loc);
      console.log("    type  : ", type);

      events.updateEvent(id, time, owner, loc, desc, type, owner, (err, data) =>{
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
