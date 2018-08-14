module.exports = (function getDataPath() {
  const dataPath = process.env.SWAGGER_MOCKS_DATA_PATH;
  if (!dataPath) {
    console.error('\nMissing mocked data directory path! You can define it with SWAGGER_MOCKS_DATA_PATH environment variable.\n');
    process.exit(1);
  }
  return dataPath;
})();