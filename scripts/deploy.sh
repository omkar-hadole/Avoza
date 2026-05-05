#!/usr/bin/env bash
###############################################################################
# scripts/deploy.sh
#
# Called by the GitHub Actions "deploy" job.
# Authenticates to ECR, builds + tags + pushes the Docker image,
# then force-deploys to ECS and waits for stability.
#
# Required env vars (set as GitHub Actions secrets):
#   AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_SESSION_TOKEN
#   AWS_REGION, AWS_ACCOUNT_ID
#   ECR_REPOSITORY   — e.g. avoza-backend-production
#   ECS_CLUSTER      — e.g. avoza-cluster-production
#   ECS_SERVICE      — e.g. avoza-service-production
#   IMAGE_TAG        — e.g. sha-abc1234
###############################################################################
set -euo pipefail

###############################################################################
# Config
###############################################################################
AWS_REGION="${AWS_REGION:?AWS_REGION is required}"
AWS_ACCOUNT_ID="${AWS_ACCOUNT_ID:?AWS_ACCOUNT_ID is required}"
ECR_REPOSITORY="${ECR_REPOSITORY:?ECR_REPOSITORY is required}"
ECS_CLUSTER="${ECS_CLUSTER:?ECS_CLUSTER is required}"
ECS_SERVICE="${ECS_SERVICE:?ECS_SERVICE is required}"
IMAGE_TAG="${IMAGE_TAG:-latest}"

ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
IMAGE_URI="${ECR_REGISTRY}/${ECR_REPOSITORY}:${IMAGE_TAG}"
IMAGE_URI_LATEST="${ECR_REGISTRY}/${ECR_REPOSITORY}:latest"

echo "================================================================"
echo " Avoza Deploy Script"
echo "================================================================"
echo " Region      : $AWS_REGION"
echo " Account     : $AWS_ACCOUNT_ID"
echo " Repository  : $ECR_REPOSITORY"
echo " Cluster     : $ECS_CLUSTER"
echo " Service     : $ECS_SERVICE"
echo " Tag         : $IMAGE_TAG"
echo " Image URI   : $IMAGE_URI"
echo "================================================================"

###############################################################################
# Step 1 — Authenticate to ECR
###############################################################################
echo ""
echo ">>> Step 1: Authenticating to ECR..."
aws ecr get-login-password --region "$AWS_REGION" \
  | docker login \
      --username AWS \
      --password-stdin "${ECR_REGISTRY}"
echo "✅  ECR authentication successful."

###############################################################################
# Step 2 — Build Docker image (from existing Dockerfile, no rewrite)
###############################################################################
echo ""
echo ">>> Step 2: Building Docker image..."
docker build \
  --build-arg NODE_ENV=production \
  --label "git.sha=${IMAGE_TAG}" \
  --label "build.date=$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
  -t "${IMAGE_URI}" \
  -t "${IMAGE_URI_LATEST}" \
  ./backend
echo "✅  Docker image built: $IMAGE_URI"

###############################################################################
# Step 3 — Push image to ECR
###############################################################################
echo ""
echo ">>> Step 3: Pushing image to ECR..."
docker push "${IMAGE_URI}"
docker push "${IMAGE_URI_LATEST}"
echo "✅  Images pushed to ECR."

###############################################################################
# Step 4 — Update ECS service (force new deployment)
###############################################################################
echo ""
echo ">>> Step 4: Triggering ECS force-new-deployment..."
aws ecs update-service \
  --cluster "$ECS_CLUSTER" \
  --service "$ECS_SERVICE" \
  --force-new-deployment \
  --region "$AWS_REGION" \
  --output json | jq -r '.service.deployments[] | "\(.status): \(.runningCount)/\(.desiredCount) tasks"'
echo "✅  Deployment triggered."

###############################################################################
# Step 5 — Wait for service stability (up to 10 min)
###############################################################################
echo ""
echo ">>> Step 5: Waiting for ECS service to stabilize (timeout: 600s)..."
aws ecs wait services-stable \
  --cluster "$ECS_CLUSTER" \
  --services "$ECS_SERVICE" \
  --region "$AWS_REGION"
echo "✅  ECS service is stable."

###############################################################################
# Step 6 — Verify
###############################################################################
echo ""
echo ">>> Step 6: Final service health check..."
aws ecs describe-services \
  --cluster "$ECS_CLUSTER" \
  --services "$ECS_SERVICE" \
  --region "$AWS_REGION" \
  --query 'services[0].{Status:status, Running:runningCount, Desired:desiredCount, Pending:pendingCount}' \
  --output table

echo ""
echo "🎉  Deployment complete!"
