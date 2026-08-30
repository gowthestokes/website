.PHONY: publish push commit help

MESSAGE ?=

help:
	@echo 'Usage: make publish MESSAGE="Describe the change"'

commit:
	@test -n "$(MESSAGE)" || { echo 'A commit message is required. Try: make publish MESSAGE="Describe the change"'; exit 2; }
	git add -A
	git commit -m "$(MESSAGE)"

push: commit
	git push origin main

publish: push
	gh workflow run deploy.yml --ref main
	@echo 'Published workflow triggered. Check: https://github.com/gowthestokes/website/actions'
