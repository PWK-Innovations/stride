# Coding Style

Single source of truth for code style. Run format/lint before commit.

## General

- Prefer clarity over cleverness; small, focused functions and components.
- One logical component or module per file; name file to match (e.g. `TaskList.tsx` for the TaskList component).

## TypeScript

- Use strict mode; no `any` (use `unknown` or proper types).
- Prefer explicit return types for exported functions and React components.
- Use `interface` for object shapes; type aliases for unions/primitives where it helps.

## Naming

- **Components**: PascalCase (e.g. `TaskList`, `PlanMyDayButton`).
- **Functions, variables, props**: camelCase.
- **Constants**: camelCase or UPPER_SNAKE for true constants.
- **Files**: PascalCase for React components (`TaskList.tsx`); camelCase for utilities/hooks (`useSchedule.ts`, `formatTime.ts`). Match Next.js conventions (e.g. `page.tsx`, `layout.tsx` for App Router).

## React / Next.js

- Functional components only; use hooks for state and side effects.
- Prefer named exports for components and key utilities (default export for Next.js pages/layouts is fine).
- Define props with interfaces (e.g. `interface TaskListProps { ... }`).
- Keep components presentational where possible; move data-fetching and logic to hooks or server components/API routes.

## Formatting

- 2 spaces; semicolons; double quotes for strings.
- Trailing commas in multiline objects/arrays.
- Max line length: 100–120 characters (wrap or break sensibly).

## Tailwind

- Use utility classes; avoid inline styles for layout/spacing.
- Order classes in a consistent way (e.g. layout → spacing → typography → colors → states); use a plugin or convention.
- Prefer `className` composition over long single strings; extract repeated patterns into components or shared class strings.

## Imports

- Order: external (React, Next, libraries) → internal (components, hooks, utils) → types; blank line between groups.
- Prefer type-only imports where applicable: `import type { Task } from "..."`.

## Comments

- Prefer self-explanatory names over comments; comment "why" when non-obvious, not "what."
