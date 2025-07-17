// jest.config.js
module.exports = {
  testEnvironment: 'node',
  reporters: [
    "default",
    ["jest-html-reporter", {
      pageTitle: "Sweet Shop Test Report",
      outputPath: "./reports/test-report.html",
      includeFailureMsg: true,
      includeSuiteFailure: true
    }]
  ]
};
