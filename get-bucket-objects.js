#!/usr/bin/env node
const argv = require('yargs').demandOption(['bucket']).argv;
const AWS = require('aws-sdk');
const fs = require('fs');
const listBucketObjects = require('./lib/list-objects');

const s3 = new AWS.S3();

function reportStatus({bucket, objects}) {
  console.log(`Loading objects for bucket ${bucket} (got ${objects.size} so far)`);
}

listBucketObjects(s3, argv.bucket, reportStatus).then((objects) => {
  const filename = `${argv.bucket}.bucket.json`;
  fs.writeFileSync(filename, JSON.stringify([...objects]), 'UTF-8');
  console.log(`Wrote: ${filename}`);
});
