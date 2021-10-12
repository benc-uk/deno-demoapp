# Common variables
VERSION := 0.0.1
BUILD_INFO := Manual build 
#SRC_DIR := cmd
SRC_DIR := ./src

# Most likely want to override these when calling `make image`
IMAGE_REG ?= ghcr.io
IMAGE_REPO ?= benc-uk/deno-demoapp
IMAGE_TAG ?= latest
IMAGE_PREFIX := $(IMAGE_REG)/$(IMAGE_REPO)

# Things you don't want to change
REPO_DIR := $(abspath $(dir $(lastword $(MAKEFILE_LIST))))
DENO_PATH ?= $(HOME)/.deno/bin/deno

.PHONY: help image push build run lint lint-fix
.DEFAULT_GOAL := help

help:  ## This help message :)
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

lint:  ## Lint & format, will not fix but sets exit code on error
	@echo "Not implemented yet!"; exit 1

lint-fix:  ## Lint & format, will try to fix errors and modify code
	@echo "Not implemented yet!"; exit 1

image:  ## Build container image from Dockerfile
	docker build --file ./build/Dockerfile \
	--build-arg BUILD_INFO="$(BUILD_INFO)" \
	--build-arg VERSION="$(VERSION)" \
	--tag $(IMAGE_PREFIX):$(IMAGE_TAG) . 

push:  ## Push container image to registry
	docker push $(IMAGE_PREFIX):$(IMAGE_TAG)

build:  ## Run a local build without a container
	deno compile --unstable --allow-all -o dist/server src/server.ts 
	rm -rf dist/views
	cp -r src/views dist

run:  ## Run application, used for local development
	cd src; $(DENO_PATH) run --allow-all --unstable server.ts

watch:  ## Run application in watch mode, used for local development
	cd src; denon run --allow-all --unstable server.ts

install-deno:  ## Install deno 
	curl -fsSL https://deno.land/x/install/install.sh | sh
