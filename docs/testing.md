# Testing Strategy

## Unit Testing

- **Framework**: Jest
- **Scope**: Test individual functions and components in isolation.
- **Coverage Targets**: Aim for 80% coverage across all modules.
- **Fixtures**: Use static JSON files for predictable inputs.

## End-to-End Testing

- **Framework**: Playwright
- **Scope**: Test user flows and interactions from the UI to the backend.
- **Coverage Targets**: Ensure all critical paths are tested, including login, recipe CRUD operations, and search functionality.
- **Fixtures**: Mock API responses where necessary to simulate different scenarios.

## Continuous Integration

- **Pipeline**: GitHub Actions
- **Steps**:
  1. Lint codebase
  2. Run unit tests
  3. Run end-to-end tests

## Reporting

- Generate test coverage reports and upload them as artifacts in the CI pipeline.
- Use badges in the README to display current test coverage status.
