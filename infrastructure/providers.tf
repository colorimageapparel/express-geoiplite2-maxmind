provider "aws" {
  region  = var.region
  profile = var.profile
  # Only these AWS Account IDs may be operated on with this provider
  allowed_account_ids = [var.account_id]
}

provider "kubernetes" {
  host                   = local.eks.endpoint
  cluster_ca_certificate = base64decode(local.eks.certificate_authority.0.data)
  exec {
    api_version = "client.authentication.k8s.io/v1alpha1"
    command     = "aws"
    args        = ["eks", "get-token", "--cluster-name", local.eks.name, "--profile", var.profile]
  }
}

provider "helm" {
  kubernetes {
    host                   = local.eks.endpoint
    cluster_ca_certificate = base64decode(local.eks.certificate_authority.0.data)
    exec {
      api_version = "client.authentication.k8s.io/v1alpha1"
      command     = "aws"
      args        = ["eks", "get-token", "--cluster-name", local.eks.name, "--profile", var.profile]
    }
  }
}

provider "kubernetes-alpha" {
  host                   = local.eks.endpoint
  cluster_ca_certificate = base64decode(local.eks.certificate_authority.0.data)
  exec = {
    api_version = "client.authentication.k8s.io/v1alpha1"
    command     = "aws"
    args        = ["eks", "get-token", "--cluster-name", local.eks.name, "--profile", var.profile]
    env = {

    }
  }
}
