const path = require('path');
// const { Server } = require('swagger-server');

const {
  yamlPath,
  dataPath,
  mockedDataLoader,
  middlewareErrorHandler
} = require('./utils');


const express = require('express');
const middleware = require('swagger-express-middleware');
const app = express();
const port = process.env.SWAGGER_SERVER_PORT || require('../package').config.port;

middleware(yamlPath, app, function(err, middleware) {
    app.use(
      middleware.metadata(),
      middleware.CORS(),
      middleware.parseRequest(),
      middleware.validateRequest(),
      middleware.mock(
        mockedDataLoader
          .yaml(yamlPath)
          .mocks(dataPath)
          .load()
      ),
      middlewareErrorHandler
    );

    app.listen(port, function() {
        console.log('listening on %s...', port);
    });
});






// const server = new Server();
// server.parse(yamlPath);



// server.use(middlewareErrorHandler);

// const port = process.env.SWAGGER_SERVER_PORT || require('../package').config.port;
// server.listen(port, () => {
//   console.log('listening on %s...', port);
// });
