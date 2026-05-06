###############################################################################
# terraform/variables.tf
###############################################################################

variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "project_name" {
  type    = string
  default = "avoza"
}

variable "environment" {
  type    = string
  default = "production"
  validation {
    condition     = contains(["dev", "staging", "production"], var.environment)
    error_message = "environment must be one of: dev, staging, production."
  }
}

variable "s3_bucket_name" {
  type    = string
  default = "avoza-app-assets"
}

variable "ecr_repository_name" {
  type    = string
  default = "avoza-backend"
}

variable "ecr_frontend_repository_name" {
  type    = string
  default = "avoza-frontend"
}

variable "image_tag" {
  type    = string
  default = "latest"
}

variable "container_port" {
  type    = number
  default = 5000
}

variable "frontend_container_port" {
  type    = number
  default = 80
}

variable "task_cpu" {
  type    = number
  default = 512
}

variable "task_memory" {
  type    = number
  default = 1024
}

variable "desired_count" {
  type    = number
  default = 1
}

variable "mongo_uri" {
  type      = string
  sensitive = true
}

variable "jwt_secret" {
  type      = string
  sensitive = true
}

variable "node_env" {
  type    = string
  default = "production"
}
