###############################################################################
# terraform/main.tf
# Root configuration — wires all modules together.
# Uses only existing AWS credentials; DOES NOT create IAM roles or policies.
###############################################################################

terraform {
  required_version = ">= 1.6.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Remote state — S3 backend (idempotent, pre-created by bootstrap script)
  backend "s3" {
    bucket         = "avoza-tfstate"          # created by scripts/bootstrap.sh
    key            = "avoza/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    use_lockfile   = true                     # Native S3 locking (TF ≥ 1.10); no DynamoDB needed
  }
}

provider "aws" {
  region = var.aws_region
}

###############################################################################
# Data sources
###############################################################################
data "aws_caller_identity" "current" {}

###############################################################################
# Modules
###############################################################################

module "s3" {
  source      = "./modules/s3"
  bucket_name = var.s3_bucket_name
  environment = var.environment
  project     = var.project_name
}

module "ecr" {
  source          = "./modules/ecr"
  repository_name = var.ecr_repository_name
  environment     = var.environment
  project         = var.project_name
}

module "ecs" {
  source = "./modules/ecs"

  project         = var.project_name
  environment     = var.environment
  aws_region      = var.aws_region
  account_id      = data.aws_caller_identity.current.account_id

  # Image
  ecr_image_uri   = "${module.ecr.repository_url}:${var.image_tag}"

  # Network — using the default VPC for AWS Academy simplicity
  vpc_id          = var.vpc_id
  subnet_ids      = var.subnet_ids

  # Task config
  container_port  = var.container_port
  task_cpu        = var.task_cpu
  task_memory     = var.task_memory
  desired_count   = var.desired_count

  # App env vars (passed as secrets in task definition env block)
  mongo_uri       = var.mongo_uri
  jwt_secret      = var.jwt_secret
  node_env        = var.node_env
}
