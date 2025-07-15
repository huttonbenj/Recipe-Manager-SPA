# CodeQL Security Scanning Setup

## Overview

This project uses GitHub's CodeQL action for static security analysis to identify potential security vulnerabilities in the codebase.

## Configuration

The CodeQL analysis is configured in the CI/CD pipeline (`.github/workflows/ci.yml`) as part of the security scanning job.

### Permissions Required

The security job requires specific permissions to function correctly:

```yaml
permissions:
  actions: read        # Read workflow run information
  contents: read       # Read repository contents
  security-events: write  # Upload security scanning results
```

### Languages Analyzed

- **JavaScript/TypeScript**: Analyzes both frontend and backend code for security vulnerabilities

### What CodeQL Checks

CodeQL performs static analysis to detect:

- SQL injection vulnerabilities
- Cross-site scripting (XSS) vulnerabilities  
- Path traversal vulnerabilities
- Authentication and authorization issues
- Cryptographic weaknesses
- Code injection vulnerabilities
- And many other security issues

## Viewing Results

Security scanning results are available in:

1. **GitHub Security Tab**: `https://github.com/{owner}/{repo}/security/code-scanning`
2. **Pull Request Checks**: Results are reported as check status on PRs
3. **Actions Logs**: Detailed logs available in the GitHub Actions workflow runs

## Troubleshooting

### Common Issues

1. **"Resource not accessible by integration" Error**
   - **Cause**: Missing required permissions for the security job
   - **Fix**: Ensure the security job has the required permissions (actions: read, contents: read, security-events: write)

2. **Telemetry Warnings**
   - **Cause**: CodeQL trying to send telemetry data without proper permissions
   - **Impact**: These warnings don't affect the analysis results, they're just informational

3. **Analysis Timeout**
   - **Cause**: Large codebase or complex analysis
   - **Fix**: Consider excluding test files and build outputs from analysis

## Best Practices

1. **Regular Updates**: Keep CodeQL action versions up to date
2. **Review Results**: Regularly review and address security findings
3. **Custom Queries**: Consider adding custom CodeQL queries for project-specific checks
4. **Integration**: Integrate with GitHub's Security Advisories for dependency vulnerabilities

## Performance

- CodeQL scans all TypeScript and JavaScript files in the repository
- Analysis typically takes 2-5 minutes depending on codebase size
- Results are cached between runs to improve performance

## Configuration Files

- **Workflow**: `.github/workflows/ci.yml` (security job)
- **No custom config**: Uses CodeQL's default security-and-quality query suite

## Next Steps

1. **Monitor Results**: Check the Security tab regularly for new findings
2. **Fix Issues**: Address any security vulnerabilities identified
3. **Custom Rules**: Consider adding project-specific security rules if needed 