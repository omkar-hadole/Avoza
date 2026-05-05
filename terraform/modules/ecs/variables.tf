###############################################################################
# terraform/modules/ecs/variables.tf
###############################################################################

variable "project" {
  type = string
}

variable "environment" {
  type = string
}

variable "aws_region" {
  type = string
}

variable "account_id" {
  type = string
}

variable "ecr_image_uri" {
  description = "Full ECR image URI including tag"
  type        = string
}

variable "container_port" {
  type    = number
  default = 5000
}

variable "task_cpu" {
  type    = number
  default = 256
}

variable "task_memory" {
  type    = number
  default = 512
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
