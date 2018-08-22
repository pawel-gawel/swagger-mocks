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

let dirPath;
let yamlDefinitions;

function setMocks(val) {
  dirPath = val;
  return loader;
}

function parseYaml(filePath) {
  yamlDefinitions = yaml.safeLoad(fs.readFileSync(filePath, 'utf8'));
  return loader;
}

function load() {
  assert(dirPath, 'No mocked data directory defined. Use mocks() method.');
  // assert(serverInstance, 'No swagger server instance defined. Use server() method.');
  traverseDir(dirPath);
  return myDB;
}

function traverseDir(dir) {
  fs.readdirSync(dir)
    .forEach((file) => {
      const filePath = path.resolve(dir, file);
      if (fs.lstatSync(filePath).isDirectory()) {
        traverseDir(filePath);
      } else {
        const uri = getUri(file);
        myDB.save(new Resource(getUri(file), require(filePath)));
        console.log('mocked data found: %s -> mapped to %s', filePath, uri);
      }
    });
}

function getUri(filename) {
  let [name] = filename.split('.');
  let uri = '/'.concat(name.split('_').join('/'));
  if (yamlDefinitions && yamlDefinitions.basePath) {
    uri = yamlDefinitions.basePath.concat(uri);
  }
  return uri;
}
