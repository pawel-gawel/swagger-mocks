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
      const filePath = path.join(dir, file);
      if (fs.lstatSync(filePath).isDirectory()) {
        traverseDir(filePath);
      } else {
        const json = require(filePath)
          .map(normalizeResource)
          .map(applyCollectionName(file))
          .map(applyCollectionPrefix);

        serverInstance.dataStore.save(Resource.parse(json));
      }
    });
}

function normalizeResource(res) {
  if (!('data' in res)) {
    return { data: res };
  }
  return res;
}

function applyCollectionName(filename) {
  let [name] = filename.split('.');
  name = name.split('-').join('/');

  return (resource) => ({ collection: `/${name}`, ...resource });
}

function applyCollectionPrefix(resource) {
  if (yamlDefinitions && yamlDefinitions.basePath) {
    return { ...resource, collection: `${yamlDefinitions.basePath}${resource.collection}` };
  }
  return resource;
}

