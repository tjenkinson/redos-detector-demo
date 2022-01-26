const { execSync } = require('child_process');

module.exports = {
  plugins: {
    'posthtml-expressions': {
      locals: {
        BUILD_VERSION: execSync('git show -s --format=%H', {
          encoding: 'utf-8',
        }).trim(),
      },
    },
  },
};
