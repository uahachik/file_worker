module.exports = function validateCsv(user) {
  for (let [key, value] of Object.entries(user)) {
    if (key !== 'age' && value === '') {
      return `invalid ${key}`;
    } else if (
      key === 'age' &&
      (value === '' ||
        !Number.isInteger(Number(value)) ||
        Math.sign(value) !== 1)
    ) {
      return 'invalid age';
    }
  }
  return;
};
