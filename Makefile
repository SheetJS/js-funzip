.PHONY: build
build: ## Build library
	npm run build

.PHONY: fullint
fullint: lint mdlint ## Run all checks

.PHONY: lint
lint: ## Run tslint checks
	npm run lint

.PHONY: mdlint
mdlint: README.md ## Check markdown documents
	alex $^
	mdspell -a -n -x -r --en-us $^

.PHONY: help
help:
	@grep -hE '(^[a-zA-Z_-][ a-zA-Z_-]*:.*?|^#[#*])' $(MAKEFILE_LIST) | bash misc/help.sh
