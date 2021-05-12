resource "aws_ecr_repository" "app_image" {
  name                 = "${var.prefix}-${var.env}-${var.app_name}"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = merge(
    {}
  )
}

# Populate ECR with an image, this runs once
resource "null_resource" "push_image" {
  provisioner "local-exec" {
    working_dir = "${path.module}/.."
    command     = <<EOF
make ecr-login profile=${var.profile} account_id=${data.aws_caller_identity.current.account_id}
docker build -t ${aws_ecr_repository.app_image.repository_url}:latest .
docker push ${aws_ecr_repository.app_image.repository_url}:latest
EOF
  }

  depends_on = [
    aws_ecr_repository.app_image
  ]
}