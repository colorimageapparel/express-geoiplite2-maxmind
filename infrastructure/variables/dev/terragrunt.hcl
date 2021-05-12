# Injects the contents of the account-level terragrunt.hcl here.
include {
  path = find_in_parent_folders()
}


# Terragrunt will copy the Terraform configurations specified by the source parameter, along with any files in the
# working directory, into a temporary folder, and execute your Terraform commands in that folder.
terraform {
  source = "../../..//infrastructure/"
}

# Set values for variables.tf
inputs = {
}