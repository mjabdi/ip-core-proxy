const routes = {};
const health = require('../routes/health');
const index = require('../routes/index');
const error = require('./../middleware/error');
const receiveformcore = require('../routes/receivefromcore');

routes.setupRoutes = (server) => {
 server.get('/', index);
 server.get('/health/ready', health.ready);
 server.get('/health/live', health.live);
 server.post('/api/sendtobank', receiveformcore);
}

module.exports = routes;