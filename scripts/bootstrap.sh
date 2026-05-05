#!/usr/bin/env bash
###############################################################################
# scripts/bootstrap.sh
#
# ONE-TIME setup — run this ONCE before the first CI run.
# Creates the S3 bucket used by the Terraform remote backend.
#
# Usage:
#   export AWS_ACCESS_KEY_ID=...
#   export AWS_SECRET_ACCESS_KEY=...
#   export AWS_SESSION_TOKEN=...
#   export AWS_REGION=us-east-1
#   bash scripts/bootstrap.sh
#
# Safe to re-run (idempotent).
###############################################################################
set -euo pipefail

BUCKET_NAME="${TF_BACKEND_BUCKET:-avoza-tfstate}"
REGION="${AWS_REGION:-us-east-1}"

echo "=== Avoza Terraform Backend Bootstrap ==="
echo "Bucket : $BUCKET_NAME"
echo "Region : $REGION"
echo ""

# ── Create bucket (skip if it already exists) ────────────────────────────────
if aws s3api head-bucket --bucket "$BUCKET_NAME" 2>/dev/null; then
  echo "✅  Bucket '$BUCKET_NAME' already exists — skipping creation."
else
  echo "Creating S3 bucket '$BUCKET_NAME'..."
  if [ "$REGION" = "us-east-1" ]; then
    # us-east-1 must NOT include LocationConstraint
    aws s3api create-bucket \
      --bucket "$BUCKET_NAME" \
      --region "$REGION"
  else
    aws s3api create-bucket \
      --bucket "$BUCKET_NAME" \
      --region "$REGION" \
      --create-bucket-configuration LocationConstraint="$REGION"
  fi
  echo "✅  Bucket created."
fi

# ── Enable versioning ────────────────────────────────────────────────────────
echo "Enabling versioning..."
aws s3api put-bucket-versioning \
  --bucket "$BUCKET_NAME" \
  --versioning-configuration Status=Enabled
echo "✅  Versioning enabled."

# ── Enable server-side encryption ────────────────────────────────────────────
echo "Enabling AES-256 encryption..."
aws s3api put-bucket-encryption \
  --bucket "$BUCKET_NAME" \
  --server-side-encryption-configuration '{
    "Rules": [{
      "ApplyServerSideEncryptionByDefault": {
        "SSEAlgorithm": "AES256"
      }
    }]
  }'
echo "✅  Encryption enabled."

# ── Block public access ───────────────────────────────────────────────────────
echo "Blocking all public access..."
aws s3api put-public-access-block \
  --bucket "$BUCKET_NAME" \
  --public-access-block-configuration \
    "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"
echo "✅  Public access blocked."

echo ""
echo "🎉  Bootstrap complete!"
echo "    Add this to your backend config:"
echo "    bucket = \"$BUCKET_NAME\""
echo "    region = \"$REGION\""
