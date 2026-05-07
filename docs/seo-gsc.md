# Search Console Reference

The Google Search Console service account key is intentionally not copied into this repo.

Use this local file reference when running SEO audits from this machine:

```bash
GOOGLE_SERVICE_ACCOUNT_FILE=/Users/austinwitherow/dev/personal/JarvisVault/Shared/secrets/build-lean-saas-service-account.json
GOOGLE_SEARCH_CONSOLE_PROPERTY=sc-domain:williamsburgmedspa.com
```

Run the GSC-only domain audit from the personal workspace root:

```bash
cd /Users/austinwitherow/dev/personal

env \
  GOOGLE_SERVICE_ACCOUNT_FILE=/Users/austinwitherow/dev/personal/JarvisVault/Shared/secrets/build-lean-saas-service-account.json \
  node scripts/seo-audit/audit-domain.mjs \
    --site sc-domain:williamsburgmedspa.com \
    --domain williamsburgmedspa.com \
    --projectRoot williamsburgmedspa.com \
    --days 28 \
    --topPages 60 \
    --rowLimit 300 \
    --siteQueryLimit 5000 \
    --pageScope published \
    --outDir williamsburgmedspa.com/artifacts/seo-audit/williamsburgmedspa.com-$(date -u +%F) \
    --envPaths /tmp/no-env-file
```

`--envPaths /tmp/no-env-file` prevents blank values in the parent workspace `.env` from shadowing the explicit service-account file path.
