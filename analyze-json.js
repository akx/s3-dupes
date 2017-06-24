const AWS = require('aws-sdk');
const fs = require('fs');
const R = require('ramda');

const DuplicateReporter = require('./lib/duplicate-reporter');
const getDuplicateGroups = require('./lib/get-duplicate-groups');
const promiseEach = require('./lib/promise-each');
const applyFilter = require('./lib/apply-filter');

const argv = (
  require('yargs')
  .demandOption(['file'])
  .option('interactive', {default: false})
  .option('exclude', {alias: 'x', type: 'array', default: []})
  .option('include', {alias: 'i', type: 'array', default: []})
).argv;

const s3 = new AWS.S3();

const allObjects = new Map(JSON.parse(fs.readFileSync(argv.file, 'UTF-8')));

const reporter = new DuplicateReporter();
applyFilter(allObjects.values(), argv.include, argv.exclude)
.then(getDuplicateGroups)
.then((groups) => R.sortBy((g) => -g.objects[0].Size, groups))
.then((groups) => promiseEach(groups, (group) => {
  reporter.printGroup(group, !argv.interactive);
  if (argv.interactive) {
    return reporter.promptDelete(group, s3);
  }
}))
.then(() => {
  reporter.printTotalWasted();
});
