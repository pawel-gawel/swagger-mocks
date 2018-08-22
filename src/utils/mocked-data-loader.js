const loader = {
  path: setPath,
  server,
  yaml: parseYaml,
  load
};

module.exports = loader;

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const assert = require('assert');
const { Resource } = require('swagger-server');

let serverInstance;
let dirPath;
let yamlDefinitions;

function setPath(val) {
  dirPath = val;
  return loader;
}

function server(val) {
  serverInstance = val;
  return loader;
}

function parseYaml(filePath) {
  yamlDefinitions = yaml.safeLoad(fs.readFileSync(filePath, 'utf8'));
  return loader;
}

function load() {
  assert(dirPath, 'No mocked data directory defined. Use path() method.');
  assert(serverInstance, 'No swagger server instance defined. Use server() method.');
  traverseDir(dirPath);
  return loader;
}

function traverseDir(dir) {
  fs.readdirSync(dir)
    .forEach((file) => {
      const filePath = path.resolve(dir, file);
      if (fs.lstatSync(filePath).isDirectory()) {
        traverseDir(filePath);
      } else {
        const uri = getUri(file);
        serverInstance.dataStore.save(new Resource(getUri(file), require(filePath)));
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
