module.exports = (function getYamlPath() {
  const yamlPath = process.env.SWAGGER_MOCKS_YAML_PATH;
  if (!yamlPath) {
    console.error('\nMissing swagger definitions file path! You can define it with SWAGGER_MOCKS_YAML_PATH environment variable.\n');
    process.exit(1);
  }
  return yamlPath;
})();