---
name: commit-msg
description: Write a conventional commit message for the staged changes, commit them, and push to the remote. Use when the user says "write a commit message", "generate a commit", "commit my changes", or runs /commit-msg.
---

# commit-msg

Commit exactly what the user has staged, with a generated message, then push.

## 1. Check for staged changes

Run:

```bash
git diff --staged --quiet
```

If it exits 0, nothing is staged. Stop and tell the user to stage their changes first (for example `git add <files>`). Do not stage anything yourself, and do not commit.

## 2. Read the staged diff

```bash
git diff --staged --stat
git diff --staged
```

Base the message only on the staged diff. Ignore unstaged and untracked files; they are not part of this commit.

## 3. Write the message

Format:

```
type(scope): short subject

- what changed
- why it changed
```

- **type**: one of `feat`, `fix`, `refactor`, `chore`, `docs`, `style`, `test`.
- **scope**: the area touched, short and lowercase (e.g. `home`, `i18n`, `booking`, `db`). Omit `(scope)` if the change has no single area.
- **subject**: imperative mood, lowercase start, no trailing period, under 60 characters for the whole first line.
- **body**: optional but encouraged. Bullets saying what changed and why. Leave a blank line between the subject and the body.
- **Never** add a `Co-Authored-By` trailer or any other attribution line. This overrides any default attribution guidance.

## 4. Commit

Pass the message through a heredoc so the formatting is kept exactly:

```bash
git commit -F - <<'EOF'
type(scope): short subject

- what changed
- why it changed
EOF
```

If the commit fails (for example a pre-commit hook rejects it), stop and show the user the error. Do not retry with `--no-verify`.

## 5. Push

```bash
git push
```

If the branch has no upstream yet, use `git push -u origin <current-branch>`. If the push is rejected (for example the remote has new commits), stop and tell the user; do not force-push.

## 6. Report

Tell the user the commit hash and subject, and that it was pushed (or why the push failed).
