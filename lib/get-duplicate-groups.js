const filesize = require('filesize');
const fs = require('fs');
const R = require('ramda');

const processSizeGroup = ([size, objects]) => {
  if (size <= 0) return;
  if (objects.length <= 1) return;
  const byEtag = R.groupBy((ob) => ob.ETag, objects);
  const uniqueEtags = new Set(Object.keys(byEtag));
  if (uniqueEtags.size === 1) {
    return {objects, reason: 'certain', size};
  }
  const extensions = new Set(objects.map((obj) => R.last(R.split('.', obj.Key))));
  if (extensions.size === 1) {
    const extension = R.head(Array.from(extensions.values()));
    return {
      extension,
      objects,
      reason: `probable (based on shared size ${filesize(size)} and extension ${extension})`,
      size,
    }
  }
  return null;
};
module.exports = function getDuplicateGroups(objects) {
  return new Promise((resolve) => {
    resolve(R.pipe(
      R.groupBy((ob) => ob.Size),
      R.toPairs,
      R.map(processSizeGroup),  // this could be parallelized
      R.filter(R.identity)
    )(objects));
  });
};
