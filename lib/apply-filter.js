module.exports = function (objects, include = [], exclude = []) {
  include = include.map((pat) => new RegExp(pat));
  exclude = exclude.map((pat) => new RegExp(pat));
  return new Promise((resolve, reject) => {
    resolve(Array.from(objects).filter((obj) => {
      if (exclude.length > 0 && exclude.some((pat) => pat.test(obj.Key))) return false;
      if (include.length > 0 && !include.some((pat) => pat.test(obj.Key))) return false;
      return true;
    }));
  });
};
