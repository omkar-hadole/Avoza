###############################################################################
# terraform/modules/s3/variables.tf
###############################################################################

variable "bucket_name" {
  description = "Base name for the S3 bucket (environment suffix is appended)"
  type        = string
}

variable "environment" {
  type = string
}

variable "project" {
  type = string
}
