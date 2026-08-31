---
name: watermelon-ui
description: Use Watermelon UI components and registry when building React frontends.
---

# Watermelon UI

Use this skill when building or modifying React frontend interfaces.

## Primary Reference

Read:

`references/watermelon-ui.md`

before selecting or installing Watermelon UI components.

## Rules

- Prefer Watermelon UI when it provides the required component.
- Use the shadcn registry CLI to install components.
- Search the registry before implementing a component from scratch.
- Preserve the application's existing architecture and styling.
- Components are copied into the project and can be customized.
- Do not install an entire UI library when only one component is needed.
- Inspect generated component code and its dependencies after installation.
- Use Tailwind CSS classes consistently with the existing project.
- Prefer composition of existing components.
- Do not invent Watermelon UI component names or registry URLs.
- If the exact component is unavailable, implement the closest solution
  using the project's existing components and conventions.

## Installation Pattern

```bash
npx shadcn@latest add "https://registry.watermelon.sh/<component-name>.json"
