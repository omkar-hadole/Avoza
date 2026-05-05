###############################################################################
# terraform/modules/ecr/variables.tf
###############################################################################

variable "repository_name" {
  type = string
}

variable "environment" {
  type = string
}

variable "project" {
  type = string
}
