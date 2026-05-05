###############################################################################
# terraform/outputs.tf
###############################################################################

output "ecr_repository_url" {
  description = "ECR repository URL (use as image base in CI)"
  value       = module.ecr.repository_url
}

output "ecs_cluster_name" {
  description = "ECS cluster name"
  value       = module.ecs.cluster_name
}

output "ecs_service_name" {
  description = "ECS service name"
  value       = module.ecs.service_name
}

output "s3_bucket_name" {
  description = "Application S3 bucket name"
  value       = module.s3.bucket_name
}

output "alb_dns_name" {
  description = "Application Load Balancer DNS name — hit this to reach the API"
  value       = module.ecs.alb_dns_name
}
