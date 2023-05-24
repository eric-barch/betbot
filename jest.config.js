/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
};