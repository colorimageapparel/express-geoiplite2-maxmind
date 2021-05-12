data "terraform_remote_state" "main" {
  backend = "s3"

  config = {
    bucket  = "${var.prefix}-${var.env}-${var.account_id}-tfstate"
    key     = "${var.env}/main.tfstate"
    region  = var.region
    profile = var.profile
  }
}

data "aws_caller_identity" "current" {}

locals {
  eks = data.terraform_remote_state.main.outputs.eks
}