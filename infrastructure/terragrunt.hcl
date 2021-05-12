locals {
  environment_vars = read_terragrunt_config("env.hcl")

  account_id = local.environment_vars.locals.account_id
  profile    = local.environment_vars.locals.profile
  env        = local.environment_vars.locals.env
  region     = "us-east-1"
  prefix     = "ecomm"
  app_name   = "geo"
}

# Configure Terragrunt to store tfstate files in an AWS S3 Bucket
remote_state {
  backend = "s3"
  config = {
    encrypt = true
    bucket  = "${local.prefix}-${local.env}-${local.account_id}-tfstate"
    key     = "${local.env}/${local.app_name}.tfstate"
    region  = local.region
    profile = local.profile
    # dynamodb_table = "terraform-locks"
  }
  generate = {
    path      = "backend.tf"
    if_exists = "overwrite_terragrunt"
  }
}

# Passes local vars to variables.tf
inputs = merge(
  local.environment_vars.locals,
  {
    prefix   = local.prefix,
    region   = local.region,
    app_name = local.app_name
  }
)