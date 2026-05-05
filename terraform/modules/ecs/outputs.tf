###############################################################################
# terraform/modules/ecs/outputs.tf
###############################################################################

output "cluster_name" {
  value = aws_ecs_cluster.main.name
}

output "service_name" {
  value = aws_ecs_service.app.name
}

output "log_group_name" {
  value = aws_cloudwatch_log_group.app.name
}

output "vpc_id" {
  description = "Default VPC ID used by ECS tasks"
  value       = data.aws_vpc.default.id
}
