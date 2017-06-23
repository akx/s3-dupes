/**
 * Call the given possibly promise-generating function {func} for each item
 * (which may be promises of items) in the {iterable}, returning a promise
 * that resolves after all items have been processed.
 * @param iterable Iterable that can be array-fied by Array.from.
 * @param func Promise-returning function.
 * @returns {Promise} Promise of {func}'s retvals per input value.
 */
module.exports = function promiseEach(iterable, func) {
  return new Promise((resolve, reject) => {
    const inputs = Array.from(iterable);
    const retvals = [];
    function next() {
      if (!inputs.length) {
        return resolve(retvals);
      }
      Promise.resolve(inputs.shift())
      .then((value) => Promise.resolve(func(value)))
      .then((retval) => retvals.push(retval))
      .then(next)
      .catch(reject);
    }
    next();
  });
};
