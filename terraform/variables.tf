###############################################################################
# terraform/variables.tf
###############################################################################

variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project identifier used for naming all resources"
  type        = string
  default     = "avoza"
}

variable "environment" {
  description = "Deployment environment (dev | staging | production)"
  type        = string
  default     = "production"

  validation {
    condition     = contains(["dev", "staging", "production"], var.environment)
    error_message = "environment must be one of: dev, staging, production."
  }
}

# ── S3 ───────────────────────────────────────────────────────────────────────
variable "s3_bucket_name" {
  description = "Globally unique name for the application S3 bucket"
  type        = string
  default     = "avoza-app-assets"
}

# ── ECR ──────────────────────────────────────────────────────────────────────
variable "ecr_repository_name" {
  description = "ECR repository name for the backend image"
  type        = string
  default     = "avoza-backend"
}

variable "image_tag" {
  description = "Docker image tag to deploy (injected by CI pipeline)"
  type        = string
  default     = "latest"
}

# ── Networking ────────────────────────────────────────────────────────────────
variable "vpc_id" {
  description = "VPC ID where ECS service will run (defaults to default VPC)"
  type        = string
}

variable "subnet_ids" {
  description = "List of subnet IDs for ECS tasks (provide public subnets for simplicity)"
  type        = list(string)
}

# ── ECS ──────────────────────────────────────────────────────────────────────
variable "container_port" {
  description = "Port the container exposes"
  type        = number
  default     = 5000
}

variable "task_cpu" {
  description = "CPU units for the ECS task (256 | 512 | 1024 | 2048 | 4096)"
  type        = number
  default     = 256
}

variable "task_memory" {
  description = "Memory (MiB) for the ECS task"
  type        = number
  default     = 512
}

variable "desired_count" {
  description = "Number of ECS task replicas"
  type        = number
  default     = 1
}

# ── App secrets (injected by CI; NOT stored in state) ────────────────────────
variable "mongo_uri" {
  description = "MongoDB connection string"
  type        = string
  sensitive   = true
}

variable "jwt_secret" {
  description = "JWT signing secret"
  type        = string
  sensitive   = true
}

variable "node_env" {
  description = "NODE_ENV value for the container"
  type        = string
  default     = "production"
}
