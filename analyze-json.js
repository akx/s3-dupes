const argv = require('yargs').demandOption(['file']).argv;
const fs = require('fs');
const R = require('ramda');
const getDuplicateGroups = require('./lib/get-duplicate-groups');
const DuplicateReporter = require('./lib/duplicate-reporter');

const allObjects = new Map(JSON.parse(fs.readFileSync(argv.file, 'UTF-8')));

const reporter = new DuplicateReporter();
getDuplicateGroups(allObjects.values()).then((groups) => {
  groups.forEach((group) => {
    reporter.printGroup(group);
  });
  reporter.printTotalWasted();
});
