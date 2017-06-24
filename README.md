# s3-dupes

S3 intra-bucket deduplicator.

## Usage

* Ensure you [have your AWS credentials set up][awscred].
* Run `node get-bucket-objects.js --bucket=mybucketname`.
  This will churn for a while - approximately 1.5 seconds per 1000 objects in the bucket.
  When it's done, `mybucketname.bucket.json` will be written to cwd.
* Run `node analyze-json.js --file=mybucketname.bucket.json`. It will print a list of duplicate groups,
  largest first.
  * You can add `--include REGEXP [REGEXP...]` and `--exclude REGEXP [REGEXP...]` to filter objects by name.
  * You can add `--interactive` to have the program prompt you for the files to delete within each group.
  
:exclamation: As it is, `s3-dupes` does _not_ hash your objects! This means false positives are entirely possible.

[awscred]: http://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-credentials-node.html
