const router = require('express').Router();

module.exports = (records) => {
    router.get('/:id', (req, res) => {
        events.findById(req.param.id, (err, data) => {
          if (err) {
              res.sendStatus(404);
          } else {
              res.send(data);
          }
        });

    });

    router.get('/', (req, res) => {
        events.getAllEvents(
          req.param.start,
          req.param.end,
          //req.param.loc,
          req.param.type,
          req.param.owner,
          (err, data) => {
          if (err) {
              res.sendStatus(404);
          } else {
              res.send(data);
          }
        });
    });

    return router;
}
