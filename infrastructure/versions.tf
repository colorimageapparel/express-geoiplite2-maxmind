terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.37"
    }

    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.1"
    }

    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.1"
    }

    kubernetes-alpha = {
      source  = "hashicorp/kubernetes-alpha"
      version = "0.3.3"
    }
  }

  required_version = "~> 0.15.1"
}