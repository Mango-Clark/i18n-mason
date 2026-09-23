# Agent instructions

- Environment: Windows 11 Home with PowerShell 7. Use PowerShell-native commands for shell and file operations. Use `npm.cmd` when invoking npm from PowerShell.
- Communicate in Korean when the user writes in Korean. Keep explanations concise and preserve technical identifiers, paths, commands, versions, and error text exactly.
- For configuration or documentation changes, keep English and Korean documentation paired and make examples match the validator's actual schema.
- When changing the config validator or its schema, run `npm.cmd test` and `npm.cmd run validate`; report the results and any checks not run.
- After each distinct, reviewable unit of work is complete, commit and push it. Use a focused commit message and push the current branch to its configured upstream. If no upstream is configured or the push fails, report the blocker.
