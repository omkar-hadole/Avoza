###############################################################################
# terraform/modules/ecs/main.tf
# ECS Fargate — NO load balancer, NO custom VPC required.
# Uses the account's default VPC + subnets (auto-discovered).
# Tasks get a public IP directly — suitable for AWS Academy.
###############################################################################

###############################################################################
# Data — existing LabRole + default VPC + its subnets
###############################################################################
data "aws_iam_role" "lab" {
  name = "LabRole"
}

data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

###############################################################################
# Security Group — allow inbound on container port + all outbound
###############################################################################
resource "aws_security_group" "ecs_tasks" {
  name        = "${var.project}-ecs-tasks-sg-${var.environment}"
  description = "Allow inbound to ECS Fargate tasks on container port"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    description = "App port"
    from_port   = var.container_port
    to_port     = var.container_port
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = local.common_tags

  lifecycle {
    create_before_destroy = true
  }
}

###############################################################################
# CloudWatch Log Group
###############################################################################
resource "aws_cloudwatch_log_group" "app" {
  name              = "/ecs/${var.project}-${var.environment}"
  retention_in_days = 30

  tags = local.common_tags
}

###############################################################################
# ECS Cluster
###############################################################################
resource "aws_ecs_cluster" "main" {
  name = "${var.project}-cluster-${var.environment}"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  tags = local.common_tags
}

resource "aws_ecs_cluster_capacity_providers" "fargate" {
  cluster_name       = aws_ecs_cluster.main.name
  capacity_providers = ["FARGATE", "FARGATE_SPOT"]

  default_capacity_provider_strategy {
    capacity_provider = "FARGATE"
    weight            = 1
    base              = 1
  }
}

###############################################################################
# ECS Task Definition
###############################################################################
resource "aws_ecs_task_definition" "app" {
  family                   = "${var.project}-${var.environment}"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.task_cpu
  memory                   = var.task_memory

  # Use existing LabRole — NO new IAM roles created
  execution_role_arn = data.aws_iam_role.lab.arn
  task_role_arn      = data.aws_iam_role.lab.arn

  container_definitions = jsonencode([
    {
      name      = "${var.project}-backend"
      image     = var.ecr_image_uri
      essential = true

      portMappings = [
        {
          containerPort = var.container_port
          protocol      = "tcp"
        }
      ]

      environment = [
        { name = "NODE_ENV",   value = var.node_env },
        { name = "PORT",       value = tostring(var.container_port) },
        { name = "MONGO_URI",  value = var.mongo_uri },
        { name = "JWT_SECRET", value = var.jwt_secret }
      ]

      healthCheck = {
        command     = ["CMD-SHELL", "node -e \"require('http').get('http://localhost:${var.container_port}/api/health', r => process.exit(r.statusCode === 200 ? 0 : 1))\""]
        interval    = 30
        timeout     = 5
        retries     = 3
        startPeriod = 60
      }

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.app.name
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "ecs"
        }
      }

      cpu    = var.task_cpu
      memory = var.task_memory
    }
  ])

  tags = local.common_tags
}

###############################################################################
# ECS Service — no load balancer, public IP per task
###############################################################################
resource "aws_ecs_service" "app" {
  name                               = "${var.project}-service-${var.environment}"
  cluster                            = aws_ecs_cluster.main.id
  task_definition                    = aws_ecs_task_definition.app.arn
  desired_count                      = var.desired_count
  launch_type                        = "FARGATE"
  platform_version                   = "LATEST"

  deployment_minimum_healthy_percent = 100
  deployment_maximum_percent         = 200

  deployment_circuit_breaker {
    enable   = true
    rollback = true
  }

  network_configuration {
    subnets          = data.aws_subnets.default.ids
    security_groups  = [aws_security_group.ecs_tasks.id]
    assign_public_ip = true   # tasks get a public IP; no NAT/VPC required
  }

  # Ignore image changes — CI drives image updates via force-new-deployment
  lifecycle {
    ignore_changes = [task_definition, desired_count]
  }

  depends_on = [aws_ecs_cluster_capacity_providers.fargate]

  tags = local.common_tags
}

###############################################################################
# Locals
###############################################################################
locals {
  common_tags = {
    Project     = var.project
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}
