# Contributing Guide

Thanks for your interest in contributing.

## How to Contribute

1. Fork the repository.
2. Create a feature branch:

   ```bash
   git checkout -b feature/your-change
   ```

3. Make your changes.
4. Test by opening `index.html` and verifying:
   - tables render correctly
   - request validation works
   - safe/unsafe logging behaves correctly
5. Commit and push:

   ```bash
   git add .
   git commit -m "Add: short description of change"
   git push origin feature/your-change
   ```

6. Open a Pull Request.

## Coding Style

- Keep JavaScript readable and modular.
- Avoid unnecessary dependencies.
- Keep UI labels clear and concise.
- Preserve Banker's Algorithm logic correctness.

## Pull Request Checklist

- [ ] Code works in browser without errors
- [ ] No unrelated files changed
- [ ] README updated (if behavior changed)
- [ ] Clear PR description added

