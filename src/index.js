const path = require('path');
const { Server } = require('swagger-server');
const {
  mockedDataLoader,
  middlewareErrorHandler
} = require('./utils');

const yamlPath = process.env.SWAGGER_MOCKS_YAML_PATH || path.join(__dirname, '../', 'api.yaml');

const server = new Server();
server.parse(yamlPath);

mockedDataLoader
  .server(server)
  .yaml(yamlPath)
  .path(path.resolve(__dirname, '../mocked-data'))
  .load();

server.use(middlewareErrorHandler);

const port = process.env.SWAGGER_SERVER_PORT || require('../package').config.port;
server.listen(port, () => {
  console.log('listening on %s...', port);
});
