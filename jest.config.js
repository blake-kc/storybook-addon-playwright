module.exports = {
  globals: {
    'ts-jest': {
      diagnostics: {
        warnOnly: true,
      },
      useESM: true,
    },
  },
  collectCoverageFrom: ['src/**/*.{ts,tsx,js,jsx}', '!src/**/*.d.ts'],
  coverageDirectory: 'coverage',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  // modulePathIgnorePatterns: ['/mocks/', '/utils/'],
  testEnvironment: 'jsdom',
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(ts|js)x?$',
  preset: 'ts-jest/presets/js-with-babel-esm',
  transform: {},
  setupFilesAfterEnv: [
    './setupTests.ts',
    './node_modules/jest-enzyme/lib/index.js',
  ],
  transformIgnorePatterns: [
    '/node_modules/(?!(p-limit|yocto-queue|normalize-url)/)',
  ],
  testPathIgnorePatterns: ['./stories/*'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
};
