const health = {};

const server = require('./../server');


health.ready = async (req, res) => {
  if (server.ready())
  {
    res.status(200).send({
      status: 'UP'
    });
  }
  else
  {
    res.status(500).send('server is not ready yet! please wait...');
  }
}

health.live = async (req, res) => {
  if (server.live())
  {
    res.status(200).send({
      status: 'UP'
    });
  }
  else
  {
    res.status(500).send('server is dead!');
  }
}

module.exports = health;
