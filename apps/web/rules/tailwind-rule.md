
---

## Important Rule

Whenever generating **Tailwind CSS** classes or **normal CSS code**, always follow this structured pattern:
- Organize styles logically into categories.
- Add **clear comments** before each group explaining their purpose.
- Keep formatting neat, consistent, and easy to debug later.

---

>
> **Constraints:**
> - Organize Tailwind classes (or plain CSS rules) into logical groups with **inline comments** (layout & box model, typography, colors, visuals, interactions/states, dark theme, accessibility, etc.).
> - If React: wrap classes with `className={cn( ... )}` and merge `className` at the end; use a utility named `cn` (assume it exists). Types should be accurate.
> - Spread `...props` last.
> - Prefer semantic HTML; include necessary ARIA attributes.
> - Keep the output **clean**, **minimal**, and **production-ready**; no dead code.
> - Do not hardcode colors; use Tailwind tokens (e.g., `text-foreground`, `bg-background`, `border-input`, `ring-ring`, `primary`, etc.).
> - Include a small usage example at the end.
>
> **API & Behavior:**
> - Props: {{props_spec}}
> - Variants (if any): {{variants_spec}}
> - Accessibility: {{a11y_requirements}}
> - States to support: {{states_list}}
> - Error/invalid handling: {{error_handling}}
>
> **Deliverables:**
> 1. The component code.
> 2. A short comment block explaining how classes are grouped.
> 3. A minimal usage snippet.
>
> **Formatting rules:**
> - Keep comments short but meaningful.
> - Use multiline `cn()` with groups separated by blank lines.
> - Follow this comment style inside `cn()`: `// Group name` on its own line, then class string on next line.
> - Keep line lengths reasonable; break long lines.
>
> **Example pattern to follow:**
>
> ```tsx
> import * as React from "react"
> import { cn } from "@/lib/utils"
>
> type {{component_name}}Props = React.ComponentProps<"{{html_tag}}"> & {
>   /** Optional: explain custom props */
>   {{custom_props}}
> }
>
> export function {{component_name}}({ className, {{custom_props}}, ...props }: {{component_name}}Props) {
>   return (
>     <{{html_tag}}
>       className={cn(
>         // Layout & box model
>         "flex w-full h-9 items-center rounded-md",
>
>         // Typography
>         "text-sm font-medium",
>
>         // Colors
>         "bg-background text-foreground border border-input",
>
>         // Visuals
>         "shadow-xs transition-colors",
>
>         // States
>         "focus-visible:ring-2 focus-visible:ring-ring",
>         "disabled:opacity-50 disabled:pointer-events-none",
>
>         // Dark theme
>         "dark:bg-muted dark:text-muted-foreground",
>
>         className
>       )}
>       {...props}
>     />
>   )
> }
>
> // Example usage
> // <{{component_name}} placeholder="Type here..." />
> ```
