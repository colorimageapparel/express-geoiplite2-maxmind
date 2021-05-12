apply console destroy graph plan output providers init show validate refresh:
	cd infrastructure/variables/$$env && terragrunt $@

import:
	cd infrastructure/variables/$$env && terragrunt $@ $$resource $$id

apply-ci:
	cd infrastructure/variables/$$env && terragrunt apply -auto-approve

fmt-check:
	cd infrastructure && terraform fmt -recursive -check
	cd infrastructure && terragrunt hclfmt --terragrunt-check

fmt:
	cd infrastructure && terraform fmt -recursive
	cd infrastructure && terragrunt hclfmt

clean-cache:
	find . -type d -name ".terragrunt-cache" -prune -exec rm -rf {} \;

install-terra-env:
	@chmod 755 scripts/install_terra_env
	./scripts/install_terra_env

set-terra-versions:
	@chmod 755 ~/.tfenv/bin/terraform
	@chmod 755 ~/.tgenv/bin/terragrunt
	@tfenv install
	@tgenv install
	@tfenv use $(shell cat .terraform-version)
	@tgenv use $(shell cat .terragrunt-version)

aws-cli-config:	
	@chmod 755 scripts/aws_cli_config
	./scripts/aws_cli_config

set-env-ci:
	@chmod 755 scripts/set_env_ci
	./scripts/set_env_ci

ecr-login:
	aws ecr get-login-password --region us-east-1 --profile $$profile | docker login --username AWS --password-stdin $$account_id.dkr.ecr.us-east-1.amazonaws.com

get-k8s-creds:
	aws eks update-kubeconfig --name $$cluster_name --region us-west-1 --profile $$profile
