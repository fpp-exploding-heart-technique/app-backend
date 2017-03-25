const router = require('express').Router();

module.exports = (User) => {

  /*
    GET
  */

  router.post('/checkin', (req, res) => {
    User.searchUsers({'email': req.body.email}, (err, data) => {
      if(err) {
        console.error(err);
        res.status(500);
        res.send({message: "Error while searching user."});
      }
      if(data.length == 0) {
        User.createUser(req.body.email, req.body.fbuserid, (err, data) => {
          if(err) {
            console.error(err);
            res.status(500);
            res.send({message: "Error while creating user."});
          }
          res.send({message: "Created new user", "data": data}); // send id
        });
      }
      res.send({message: "Successfully checked in", "data":data[0]._id});
    });
  });





  return router;
}
