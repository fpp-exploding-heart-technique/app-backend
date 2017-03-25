const router = require('express').Router();

module.exports = (pois) => {
    router.get('/initdb', (req, res) => {
      const data = [
        {
          name        : pois.readName("ITU Ormanı"),
          location    : pois.readLocation("41.105233, 29.028161"),
          description : pois.readDescription("itü kampüsünde kamp alanı")
        },
        {
          name        : pois.readName("ITU KMB"),
          location    : pois.readLocation("41.105205, 29.026477"),
          description : pois.readDescription("kimya-metalurji binası. itüde en sevilen fakülte")
        },
        {
          name        : pois.readName("ITU EEB"),
          location    : pois.readLocation("41.104911, 29.024269"),
          description : pois.readDescription("itü elektrik-elektronik fakültesi binası. yuvamız.")
        }
      ];
      var r = 0;
      data.map(x => pois.create(
        x, (err,data)=>{console.log(x,err);}
      ));
      console.log(r);
      res.sendStatus(200);

    });

    // get event by id
    router.get('/:id', (req, res) => {
        console.log(req.params.id);
        pois.findById(req.params.id, (err, data) => {
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

    // get pois, maybe filtered
    // filter by location: find points in a radius
    //     loc=36,42  enlem,boylam cifti
    //     radius= 200  200 metre yaricapinda ara
    router.get('/', (req, res) => {
      // build the query
      var query = {};
      var t;
      if(t = pois.readLocation(req.param("loc"))) {
        var r = Number(req.param("radius"));
        query.location = {
          $near: {
            $geometry: loc,
            $maxDistance: (r ? r : 1000)
          }
        };
      }

      // execute
      pois.find(query, (err, data) => {
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

    // create poi
    router.post('/', (req, res) => {
      var e = {attendees : [], requests: []};
      var t;
      e.name        = pois.readName(req.body.title);
      e.location    = pois.readLocation(req.body.loc);
      e.description = pois.readDescription(req.body.desc);
      console.log("Create: ", e);
      if ( e.description && e.name && e.location ) {
        pois.createEvent(e, (err, data) => {
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


    return router;
}
