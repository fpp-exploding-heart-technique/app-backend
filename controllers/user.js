const router = require('express').Router();

module.exports = (User) => {

  /*
    GET
  */
  router.get('/initdb', (req, res) => {
    User.dropCollection((err) => {
      if ( err ) {
        console.error(err);
        res.sendStatus(500);
      } else {
        res.sendStatus(200);
      }
    });
  });
  router.post('/checkin', (req, res) => {
    if(!req.body.name || !req.body.facebook){
      res.status(400);
      res.send({message: "Some parameters are missing"});
    }
    User.findByFBId(req.body.facebook, (err, data) => {
      if(err) {
        console.error(err);
        res.status(500);
        res.send({message: "Error while searching user."});
      }
      if( data )
        res.send({message: "Successfully checked in", "data":data._id});

      else {
        User.createUser(req.body.name, req.body.facebook, (err, data) => {
          if(err) {
            console.error(err);
            res.status(500);
            res.send({message: "Error while creating user."});
          }
          res.send({message: "Created new user", "data": data}); // send id
        });
      }
    });
  });

  router.get('/:id', (req, res) => {
    User.findByFBId(req.params.id, (err, data) => {
      if(err) {
        console.error(err);
        res.status(500);
        res.send({message: "Error while searching user."});
      }
      if( data ) {
        res.send(data);
      }
      res.status(404);
      res.send({message: "User not found."});
    });
  });



  return router;
}
