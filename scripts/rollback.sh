#!/usr/bin/env bash
###############################################################################
# scripts/rollback.sh
#
# Emergency rollback — reverts ECS service to the previous stable task
# definition revision without touching Terraform state.
#
# Usage:
#   AWS_REGION=us-east-1 ECS_CLUSTER=avoza-cluster-production \
#   ECS_SERVICE=avoza-service-production bash scripts/rollback.sh
###############################################################################
set -euo pipefail

AWS_REGION="${AWS_REGION:?AWS_REGION is required}"
ECS_CLUSTER="${ECS_CLUSTER:?ECS_CLUSTER is required}"
ECS_SERVICE="${ECS_SERVICE:?ECS_SERVICE is required}"

echo "================================================================"
echo " Avoza Rollback Script"
echo " Cluster : $ECS_CLUSTER"
echo " Service : $ECS_SERVICE"
echo "================================================================"

# ── Get current task definition family ───────────────────────────────────────
CURRENT_TD=$(aws ecs describe-services \
  --cluster "$ECS_CLUSTER" \
  --services "$ECS_SERVICE" \
  --region "$AWS_REGION" \
  --query 'services[0].taskDefinition' \
  --output text)

FAMILY=$(echo "$CURRENT_TD" | cut -d: -f6 | cut -d/ -f2)
CURRENT_REV=$(echo "$CURRENT_TD" | cut -d: -f7)
PREVIOUS_REV=$((CURRENT_REV - 1))

echo ""
echo "Current task definition  : ${FAMILY}:${CURRENT_REV}"
echo "Rolling back to revision : ${FAMILY}:${PREVIOUS_REV}"

if [ "$PREVIOUS_REV" -lt 1 ]; then
  echo "❌  No previous revision to roll back to."
  exit 1
fi

# ── Update service to previous revision ──────────────────────────────────────
aws ecs update-service \
  --cluster "$ECS_CLUSTER" \
  --service "$ECS_SERVICE" \
  --task-definition "${FAMILY}:${PREVIOUS_REV}" \
  --region "$AWS_REGION" \
  --output json | jq -r '.service.deployments[] | "\(.status): \(.runningCount)/\(.desiredCount) tasks"'

echo ""
echo "Waiting for rollback to stabilize..."
aws ecs wait services-stable \
  --cluster "$ECS_CLUSTER" \
  --services "$ECS_SERVICE" \
  --region "$AWS_REGION"

echo "✅  Rollback complete → ${FAMILY}:${PREVIOUS_REV}"
