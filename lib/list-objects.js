const noop = () => 8;
module.exports = function listBucketObjects(s3, bucket, statusCallback = noop) {
  return new Promise((resolve, reject) => {
    const objects = new Map();
    const next = (params = {}) => {
      statusCallback({bucket, objects});
      const finalParams = Object.assign({}, {Bucket: bucket}, params);
      s3.listObjectsV2(finalParams, (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        (data.Contents || []).forEach((obj) => objects.set(obj.Key, Object.assign(obj, {bucket})));
        if (data.NextContinuationToken) {
          next({ContinuationToken: data.NextContinuationToken});
          return;
        }
        resolve(objects);
      });
    };
    next();
  });
};
