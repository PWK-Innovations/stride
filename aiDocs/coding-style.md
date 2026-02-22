# Coding Style

Single source of truth for code style. Run format/lint before commit.

**Template reference:** Use the **oatmeal-olive-instrument** template in `ai/guides/reference/oatmeal-olive-instrument/`. Follow its layout, components, and patterns for all app UI. Design system: olive color palette (e.g. `olive-50`–`olive-950`), **Instrument Serif** for display, **Inter** for sans; Tailwind theme and structure as in that folder. This file covers general conventions (naming, formatting, TypeScript).

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

- Use the oatmeal-olive-instrument theme: olive palette (`olive-*`), `font-display` (Instrument Serif), `font-sans` (Inter). Mirror `ai/guides/reference/oatmeal-olive-instrument/tailwind.css` in the app.
- Use utility classes; avoid inline styles for layout/spacing.
- Order classes in a consistent way (e.g. layout → spacing → typography → colors → states); use a plugin or convention.
- Prefer `className` composition over long single strings; extract repeated patterns into components or shared class strings.

## Imports

- Order: external (React, Next, libraries) → internal (components, hooks, utils) → types; blank line between groups.
- Prefer type-only imports where applicable: `import type { Task } from "..."`.

## Comments

- Prefer self-explanatory names over comments; comment "why" when non-obvious, not "what."
