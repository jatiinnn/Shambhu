const { getDataConnect, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'default',
  service: 'shambhu',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;

