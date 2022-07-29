const sum = require('./sum').default;

test('test @testing-library/react : adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});