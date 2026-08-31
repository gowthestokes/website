.PHONY: publish push commit help

MESSAGE ?=

help:
	@printf '\n🚀 Publish your site\n\n   make publish MESSAGE="Describe the change"\n\n'

commit:
	@test -n "$(MESSAGE)" || { printf '\n❌ A commit message is required.\n   Try: make publish MESSAGE="Describe the change"\n\n'; exit 2; }
	@printf '\n📝 Creating commit\n'
	@git add -A
	@git commit -m "$(MESSAGE)"
	@printf '✅ Commit created\n'

push: commit
	@printf '\n⬆️  Pushing main to origin\n'
	@git push origin main
	@printf '✅ Push complete\n'

publish:
	@test -n "$(MESSAGE)" || { printf '\n❌ A commit message is required.\n   Try: make publish MESSAGE="Describe the change"\n\n'; exit 2; }
	@printf '\n🚀 Publishing website\n\n[░░░░░░░░░░░░] 0/3  📝 Preparing commit\n'
	@git add -A
	@printf '\n[████░░░░░░░░] 1/3  📝 Creating commit\n'
	@git commit -m "$(MESSAGE)"
	@printf '\n[████████░░░░] 2/3  ⬆️  Pushing main to origin\n'
	@git push origin main
	@printf '\n[████████████] 3/3  🚀 Triggering deployment\n'
	@gh workflow run deploy.yml --ref main
	@printf '\n[████████████] 3/3  ✅ Published\n   Watch progress: https://github.com/gowthestokes/website/actions\n\n'
