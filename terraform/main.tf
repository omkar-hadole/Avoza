###############################################################################
# terraform/main.tf
# Root configuration — wires all modules together.
# Uses only existing AWS credentials; DOES NOT create IAM roles or policies.
# No ALB, no custom VPC — ECS tasks use the default VPC with public IPs.
###############################################################################

terraform {
  required_version = ">= 1.6.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket       = "avoza-tfstate"
    key          = "avoza/terraform.tfstate"
    region       = "us-east-1"
    encrypt      = true
  }
}

provider "aws" {
  region = var.aws_region
}

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

module "ecr_frontend" {
  source          = "./modules/ecr"
  repository_name = var.ecr_frontend_repository_name
  environment     = var.environment
  project         = var.project_name
}

module "ecs" {
  source = "./modules/ecs"

  project        = var.project_name
  environment    = var.environment
  aws_region     = var.aws_region
  account_id     = data.aws_caller_identity.current.account_id

  ecr_image_uri           = "${module.ecr.repository_url}:${var.image_tag}"
  frontend_ecr_image_uri  = "${module.ecr_frontend.repository_url}:${var.image_tag}"

  container_port          = var.container_port
  frontend_container_port = var.frontend_container_port
  task_cpu       = var.task_cpu
  task_memory    = var.task_memory
  desired_count  = var.desired_count

  mongo_uri      = var.mongo_uri
  jwt_secret     = var.jwt_secret
  node_env       = var.node_env
}
