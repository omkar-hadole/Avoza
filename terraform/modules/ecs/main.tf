###############################################################################
# terraform/modules/ecs/main.tf
# ECS Fargate cluster + task + service + ALB + security groups
# NO IAM roles are created — uses existing LabRole / task execution role
###############################################################################

###############################################################################
# Data — existing LabRole (AWS Academy)
###############################################################################
data "aws_iam_role" "lab" {
  name = "LabRole"
}

###############################################################################
# Security Groups
###############################################################################

# ALB security group — open 80/443 to the internet
resource "aws_security_group" "alb" {
  name        = "${var.project}-alb-sg-${var.environment}"
  description = "Allow HTTP/HTTPS inbound to ALB"
  vpc_id      = var.vpc_id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
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

# ECS tasks security group — only allow traffic from ALB
resource "aws_security_group" "ecs_tasks" {
  name        = "${var.project}-ecs-tasks-sg-${var.environment}"
  description = "Allow traffic from ALB to ECS tasks"
  vpc_id      = var.vpc_id

  ingress {
    from_port       = var.container_port
    to_port         = var.container_port
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
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
# Application Load Balancer
###############################################################################

resource "aws_lb" "main" {
  name               = "${var.project}-alb-${var.environment}"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = var.subnet_ids

  enable_deletion_protection = false

  tags = local.common_tags
}

resource "aws_lb_target_group" "app" {
  name        = "${var.project}-tg-${var.environment}"
  port        = var.container_port
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip" # Fargate requires ip target type

  health_check {
    enabled             = true
    healthy_threshold   = 2
    unhealthy_threshold = 3
    timeout             = 5
    interval            = 30
    path                = "/api/health"
    matcher             = "200"
  }

  tags = local.common_tags

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.main.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.app.arn
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
        { name = "NODE_ENV", value = var.node_env },
        { name = "PORT", value = tostring(var.container_port) },
        { name = "MONGO_URI", value = var.mongo_uri },
        { name = "JWT_SECRET", value = var.jwt_secret }
      ]

      # Health check mirrors the /api/health endpoint
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

      # Resource limits
      cpu    = var.task_cpu
      memory = var.task_memory
    }
  ])

  tags = local.common_tags
}

###############################################################################
# ECS Service
###############################################################################

resource "aws_ecs_service" "app" {
  name                               = "${var.project}-service-${var.environment}"
  cluster                            = aws_ecs_cluster.main.id
  task_definition                    = aws_ecs_task_definition.app.arn
  desired_count                      = var.desired_count
  launch_type                        = "FARGATE"
  platform_version                   = "LATEST"
  health_check_grace_period_seconds  = 120

  # Rolling deployment — zero-downtime updates
  deployment_minimum_healthy_percent = 100
  deployment_maximum_percent         = 200

  deployment_circuit_breaker {
    enable   = true
    rollback = true # automatic rollback on failed deployment
  }

  network_configuration {
    subnets          = var.subnet_ids
    security_groups  = [aws_security_group.ecs_tasks.id]
    assign_public_ip = true # needed for pulling ECR images without NAT
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.app.arn
    container_name   = "${var.project}-backend"
    container_port   = var.container_port
  }

  # Ignore image changes here — CI handles image updates via force-new-deployment
  lifecycle {
    ignore_changes = [task_definition, desired_count]
  }

  depends_on = [
    aws_lb_listener.http,
    aws_ecs_cluster_capacity_providers.fargate
  ]

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
