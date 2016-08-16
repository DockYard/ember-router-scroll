/*jshint node:true*/
module.exports = {
  "framework": "qunit",
  "test_page": "tests/index.html?hidepassed&nolint",
  "disable_watching": true,
  "launch_in_ci": [
    "PhantomJS"
  ],
  "launch_in_dev": [
    "PhantomJS",
    "Chrome"
  ],
  launch_in_ci: [
    'Chrome Custom',
  ],
  launch_in_dev: [
    'Chrome Custom',
  ],
  launchers: {
    'Chrome Custom': {
      exe: [
        'google-chrome',
        '~/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      ],
      args: [
        '--user-data-dir=/tmp/testem.chrome.custom',
        '--no-default-browser-check',
        '--no-first-run',
        '--ignore-certificate-errors',
        '--test-type',
        '--disable-extensions',
        '--disable-web-security',
        '--disable-renderer-backgrounding',
        '--disable-background-timer-throttling',
      ],
      protocol: 'browser',
    },
  },
};
