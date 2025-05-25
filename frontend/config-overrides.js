const path = require('path');

module.exports = function override(config) {
  config.resolve = {
    ...config.resolve,
    alias: {
      ...config.resolve.alias,
      '@hooks': path.resolve(__dirname, 'src/shared/hooks'),
      '@shared': path.resolve(__dirname, 'src/shared')
    }
  };
  return config;
};
