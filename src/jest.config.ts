export default {
  // roots: ['<rootDir>/src'],
  // collectCoverageFrom: ['<rootDir>/src'],
  roots: ['src'],
  collectCoverageFrom: ['src/**/*.ts*'],
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  testEnvironment: 'node',
  transform: {
    '.\\.ts$': 'ts-jest'
  },
  modulePathIgnorePatterns: [
    'src/interfaces',
    'src/services',
    'src/entities/medical-specialties.ts',
  ],
  verbose: true
};
