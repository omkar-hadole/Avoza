###############################################################################
# terraform/outputs.tf
###############################################################################

output "ecr_repository_url" {
  value = module.ecr.repository_url
}

output "ecs_cluster_name" {
  value = module.ecs.cluster_name
}

output "ecs_service_name" {
  value = module.ecs.service_name
}

output "s3_bucket_name" {
  value = module.s3.bucket_name
}

output "cloudwatch_log_group" {
  description = "CloudWatch log group — check here for app logs"
  value       = module.ecs.log_group_name
}
