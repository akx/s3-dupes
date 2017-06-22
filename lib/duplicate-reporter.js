const filesize = require('filesize');

class DuplicateReporter {
  constructor(print = null) {
    this.totalWastedBytes = 0;
    if (print === null) {
      print = console.log.bind(console);
    }
    this.print = print;
  }

  printGroup(group) {
    const {size, reason, objects} = group;
    this.print(`*** size: ${filesize(size)} - ${reason}`);
    objects.forEach((object) => {
      this.print(object.Key);
    });
    this.print('');
    this.totalWastedBytes += size * (objects.length - 1);
  }

  printTotalWasted() {
    this.print(`**** total wasted: ${filesize(this.totalWastedBytes)}`);
  }
}

module.exports = DuplicateReporter;
