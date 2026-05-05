###############################################################################
# terraform/modules/ecr/main.tf
# Idempotent ECR repository with image scanning + lifecycle policy
###############################################################################

resource "aws_ecr_repository" "app" {
  name                 = "${var.repository_name}-${var.environment}"
  image_tag_mutability = "MUTABLE" # allows :latest overwrite

  image_scanning_configuration {
    scan_on_push = true # automatic vulnerability scan on every push
  }

  encryption_configuration {
    encryption_type = "AES256"
  }

  tags = {
    Name        = "${var.repository_name}-${var.environment}"
    Project     = var.project
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

# Keep last 10 tagged images; auto-expire untagged images after 1 day
resource "aws_ecr_lifecycle_policy" "app" {
  repository = aws_ecr_repository.app.name

  policy = jsonencode({
    rules = [
      {
        rulePriority = 1
        description  = "Expire untagged images after 1 day"
        selection = {
          tagStatus   = "untagged"
          countType   = "sinceImagePushed"
          countUnit   = "days"
          countNumber = 1
        }
        action = { type = "expire" }
      },
      {
        rulePriority = 2
        description  = "Keep last 10 tagged images"
        selection = {
          tagStatus     = "tagged"
          tagPrefixList = ["v", "sha-", "latest"]
          countType     = "imageCountMoreThan"
          countNumber   = 10
        }
        action = { type = "expire" }
      }
    ]
  })
}
