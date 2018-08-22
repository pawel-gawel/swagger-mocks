const path = require('path');

const {
  yamlPath,
  mockedDataLoader,
  middlewareErrorHandler
} = require('./utils');


const express = require('express');
const middleware = require('swagger-express-middleware');
const app = express();
const port = process.env.SWAGGER_SERVER_PORT || require('../package').config.port;
const mocksPath = process.env.SWAGGER_MOCKS_DATA_PATH;

middleware(yamlPath, app, function(err, middleware) {
    app.use(
      middleware.metadata(),
      middleware.CORS(),
      middleware.parseRequest(),
      middleware.validateRequest()
    );

    if (mocksPath) {
      app.use(
        middleware.mock(
          mockedDataLoader
            .yaml(yamlPath)
            .mocks(mocksPath)
            .load()
        )
      );
    }

    app.use(middlewareErrorHandler);

    app.listen(port, function() {
      console.log('listening on %s...', port);
    });
});
