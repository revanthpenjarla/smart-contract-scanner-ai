# Watermelon UI Reference

## Official Source

Watermelon UI:
https://ui.watermelon.sh/

Installation:
https://ui.watermelon.sh/installation

Official repository:
https://github.com/WatermelonCorp/watermellon-registry

## What Watermelon UI Is

Watermelon UI is a React UI component registry.

It provides production-ready, copy-pasteable React components rather
than functioning as a monolithic component library.

Components are added directly into the application source code,
giving the project ownership and control over the component code.

## Core Stack

- React 18+; React 19 recommended
- TypeScript
- Tailwind CSS v4
- Radix UI
- Framer Motion
- shadcn/ui registry protocol
- Recharts for chart components

## Installation

Recommended installation method:

npx shadcn@latest add "https://registry.watermelon.sh/<component-name>.json"

Examples:

npx shadcn@latest add "https://registry.watermelon.sh/button.json"

npx shadcn@latest add "https://registry.watermelon.sh/animated-accordion.json"

npx shadcn@latest add "https://registry.watermelon.sh/chart.json"

## Registry Architecture

Watermelon UI uses the shadcn registry protocol.

Components are fetched from:

https://registry.watermelon.sh/

Individual registry resources use:

https://registry.watermelon.sh/<component-name>.json

Blocks may use:

https://registry.watermelon.sh/r/<block-name>.json

Example:

npx shadcn@latest add https://registry.watermelon.sh/r/hero-1.json

## Project Requirements

Before adding components, the application should have:

- React
- Tailwind CSS v4
- A working `@/` path alias pointing to the source directory
- shadcn-compatible configuration

Typical projects include Next.js or Vite applications.

## Component Philosophy

Components are copied into the project.

They are not intended to remain hidden behind a large external
component dependency.

After installation, the developer owns the component source and
can modify it.

## Component Categories

Watermelon UI contains components such as:

### Inputs

- Button
- Input
- Checkbox
- Select
- Switch
- Slider
- AI Input

### Data Display

- Card
- Avatar
- Badge
- Alert
- Accordion
- Table

### Feedback

- Dialog
- Alert Dialog
- Toast / Sonner
- Progress

### Navigation

- Breadcrumb
- Tabs
- Sidebar
- Carousel

### Layout

- Separator
- Collapsible
- Split Panels

### Charts

- Area
- Bar
- Line
- Pie
- Radar

Charts use Recharts where applicable.

### Blocks

- Hero sections
- Navigation sections
- Footer sections
- Pricing sections
- FAQ sections
- Dashboards
- Login pages
- Full-page UI sections

## Agent Usage Rules

When building a frontend:

1. Prefer Watermelon UI components when an appropriate component
   already exists.
2. Search the Watermelon UI registry before creating a component
   from scratch.
3. Use the shadcn CLI registry installation method when adding a
   component.
4. Do not recreate an existing Watermelon component unnecessarily.
5. After installation, inspect the generated source before modifying it.
6. Keep component code inside the project's normal component structure.
7. Preserve the project's existing Tailwind and shadcn conventions.
8. Do not introduce an unrelated UI library merely to implement a
   component that Watermelon UI already provides.
9. Components are customizable after installation.
10. Prefer composition of existing components over unnecessary
    duplication.

## Registry Examples

Hero:

npx shadcn@latest add https://registry.watermelon.sh/r/hero-1.json

Navigation:

npx shadcn@latest add https://registry.watermelon.sh/r/navigation-5.json

FAQ:

npx shadcn@latest add https://registry.watermelon.sh/r/faq-1.json

Footer:

npx shadcn@latest add https://registry.watermelon.sh/r/footer-2.json

## Important

Watermelon UI is a source-code component registry.

Do not assume that installing Watermelon UI means importing every
component from a package.

Install only the components required by the application.

Always check the current Watermelon UI registry for the exact
component and installation command because the registry evolves.
