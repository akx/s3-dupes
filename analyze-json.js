const argv = require('yargs').demandOption(['file']).argv;
const fs = require('fs');
const R = require('ramda');
const getDuplicateGroups = require('./lib/get-duplicate-groups');
const filesize = require('filesize');

const allObjects = new Map(JSON.parse(fs.readFileSync(argv.file, 'UTF-8')));

let wastedBytes = 0;

function reportDuplicates({objects, reason, size}) {
  console.log(`*** size: ${filesize(size)} - ${reason}`);
  objects.forEach((object) => {
    console.log(object.Key);
  });
  console.log('');
  wastedBytes += size * (objects.length - 1);
}

getDuplicateGroups(allObjects.values()).then((groups) => {
  groups.forEach((group) => {
    reportDuplicates(group);
  });
  console.log(`**** total wasted: ${filesize(wastedBytes)}`);
});
