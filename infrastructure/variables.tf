
variable "account_id" {
  description = "AWS Account ID for the current Terraform operation"
}
variable "profile" {
  description = "AWS config profile name"
}
variable "prefix" {
  description = "Prefix used for naming resources"
}
variable "region" {
  description = "AWS region for provider configuration"
}

variable "env" {
  description = "Environment name"
}

variable "app_name" {
  description = "Application name"
}
