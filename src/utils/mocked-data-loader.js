const loader = {
  mocks: setMocks,
  yaml: parseYaml,
  load
};

module.exports = loader;

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const assert = require('assert');
const swagger = require('swagger-express-middleware');
const { Middleware, MemoryDataStore, Resource } = swagger;

const myDB = new MemoryDataStore();

let mocksPath;
let yamlDefinitions;

function setMocks(val) {
  mocksPath = val;
  return loader;
}

function parseYaml(filePath) {
  yamlDefinitions = yaml.safeLoad(fs.readFileSync(filePath, 'utf8'));
  return loader;
}

function load() {
  assert(mocksPath, 'No mocked data directory defined. Use mocks() method.');
  traverseDir(mocksPath);
  return myDB;
}

function traverseDir(dir) {
  fs.readdirSync(dir)
    .forEach((file) => {
      const filePath = path.resolve(dir, file);
      if (fs.lstatSync(filePath).isDirectory()) {
        traverseDir(filePath);
      } else {
        const relativeFilePath = path.relative(mocksPath, filePath);
        const uri = getUri(relativeFilePath);
        myDB.save(new Resource(uri, require(filePath)));
        console.log('mocked data found: %s -> mapped to %s', relativeFilePath, uri);
      }
    });
}

function getUri(filePath) {
  let [uri] = filePath.split('.');
  uri = '/'.concat(uri);
  if (yamlDefinitions && yamlDefinitions.basePath) {
    uri = yamlDefinitions.basePath.concat(uri);
  }
  return uri;
}
