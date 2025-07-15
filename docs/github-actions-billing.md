# GitHub Actions Billing & CI Optimization

## The Issue

GitHub Actions has usage limits based on your account type:

### **Free Tier (Personal Accounts)**
- **2,000 minutes/month** for private repositories
- **Unlimited** for public repositories
- **500 MB storage** for artifacts and logs

### **Paid Plans**
- **GitHub Pro**: $4/month, 3,000 minutes
- **GitHub Team**: $4/user/month, 3,000 minutes per user
- **GitHub Enterprise**: $21/user/month, 50,000 minutes per user

## Our Solution: Lightweight CI

We've created two CI/CD workflows:

### **1. `ci-lite.yml` (Active)**
- **Optimized for free tier**
- Combines multiple jobs into one to reduce overhead
- Estimated usage: ~8-12 minutes per run
- Essential checks only:
  - Code quality (ESLint, TypeScript)
  - Security scanning (npm audit)
  - All tests (frontend & backend)
  - Application builds
  - Docker builds (main branch only)

### **2. `ci-full.yml.disabled` (Comprehensive)**
- **Full-featured pipeline** (disabled to save minutes)
- Separate jobs for maximum parallelization
- Performance testing with Lighthouse
- Advanced security scanning
- Multi-environment deployments
- Estimated usage: ~25-35 minutes per run

## Optimizations Applied

### **Minutes Reduction**
- ✅ **Combined Jobs**: Reduced from 10 jobs to 2 jobs
- ✅ **Conditional Execution**: Skip unnecessary runs
- ✅ **Docker builds**: Only on main branch
- ✅ **Removed**: Performance tests, deployment notifications
- ✅ **Simplified**: Security scanning

### **Smart Triggering**
```yaml
if: github.event_name == 'push' || (github.event_name == 'pull_request' && github.event.action != 'closed')
```
- Skips draft PRs and closed PRs
- Only runs on relevant events

### **Resource Optimization**
- Single PostgreSQL service instead of multiple
- Minimal artifact uploads
- Essential testing only

## Monitoring Usage

### **Check Your Usage**
1. Go to GitHub Settings → Billing & plans
2. View "Actions & Packages" usage
3. Monitor monthly consumption

### **Usage Estimates (per run)**
- **Lite CI**: ~10 minutes
- **With 20 commits/month**: ~200 minutes (well within free tier)

## When to Upgrade

### **Consider GitHub Pro ($4/month) if:**
- You exceed 2,000 minutes/month consistently
- You need advanced features:
  - Performance testing
  - Multi-environment deployments
  - Enhanced security scanning
  - Advanced workflow features

### **Alternatives to Consider**
- **Make repository public** (unlimited Actions minutes)
- **Use other CI services**:
  - GitLab CI (400 minutes free)
  - CircleCI (2,500 credits/month)
  - Travis CI (10,000 credits/month)

## Enabling Full CI

If you upgrade or make the repo public:

```bash
# Enable full CI pipeline
mv .github/workflows/ci-full.yml.disabled .github/workflows/ci-full.yml
# Remove lite version
rm .github/workflows/ci-lite.yml
```

## Local Development

To reduce CI dependency, ensure robust local testing:

```bash
# Run all checks locally
npm run lint
npm run type-check
npm run test
npm run build
npm audit
```

## Cost Monitoring Script

```bash
# Check if approaching limits (run monthly)
echo "GitHub Actions Usage Monitor"
echo "Check your usage at: https://github.com/settings/billing"
echo "Free tier: 2,000 minutes/month"
echo "Current repo estimated usage: ~200 minutes/month"
```

## Conclusion

The lite CI provides excellent coverage while staying within GitHub's free tier. Monitor your usage and upgrade only when necessary for your development workflow. 