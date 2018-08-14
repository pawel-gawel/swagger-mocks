const path = require('path');
const { Server } = require('swagger-server');
const {
  yamlPath,
  dataPath,
  mockedDataLoader,
  middlewareErrorHandler
} = require('./utils');

const server = new Server();
server.parse(yamlPath);

mockedDataLoader
  .server(server)
  .yaml(yamlPath)
  .path(dataPath)
  .load();

server.use(middlewareErrorHandler);

const port = process.env.SWAGGER_SERVER_PORT || require('../package').config.port;
server.listen(port, () => {
  console.log('listening on %s...', port);
});
