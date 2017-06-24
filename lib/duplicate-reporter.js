const filesize = require('filesize');
const inquirer = require('inquirer');
const {promisify} = require('util');

class DuplicateReporter {
  constructor(print = null) {
    this.totalWastedBytes = 0;
    if (print === null) {
      print = console.log.bind(console);
    }
    this.print = print;
  }

  printGroup(group, printItems = true) {
    const {size, reason, objects} = group;
    this.print(`*** size: ${filesize(size)} - ${reason}`);
    if (printItems) {
      objects.forEach((object) => {
        this.print(object.Key);
      });
      this.print('');
    }
    this.totalWastedBytes += size * (objects.length - 1);
  }

  promptDelete(group, s3) {
    const deleteObjectsAsync = promisify(s3.deleteObjects.bind(s3));
    return inquirer.prompt([
      {
        type: 'checkbox',
        name: 'objectsToDelete',
        message: 'Choose objects to delete.',
        choices: group.objects.map((object) => ({name: object.Key, value: object})),
      },
    ]).then(({objectsToDelete}) => {
      if (!objectsToDelete.length) return;
      console.log(`Deleting ${objectsToDelete.length} objects...`);
      return deleteObjectsAsync({
        Bucket: objectsToDelete[0].bucket,
        Delete: {
          Objects: objectsToDelete.map((obj) => ({Key: obj.Key})),
        },
      }).then((resp) => console.log('Deleted:', resp));
    });
  }

  printTotalWasted() {
    this.print(`**** total wasted: ${filesize(this.totalWastedBytes)}`);
  }
}

module.exports = DuplicateReporter;
