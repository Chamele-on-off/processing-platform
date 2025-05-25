const { override, addWebpackAlias } = require('customize-cra');
const path = require('path');

module.exports = override(
  addWebpackAlias({
    '@hooks': path.resolve(__dirname, 'src/shared/hooks'),
    '@shared': path.resolve(__dirname, 'src/shared'),
    '@components': path.resolve(__dirname, 'src/shared/components'),
    '@services': path.resolve(__dirname, 'src/services')
  })
);
