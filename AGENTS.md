<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Terminal 2.0 Design System

## Site Overview
- Next.js 16.2.5 + TypeScript
- Version: site@0.2.0
- Dev: `npm run dev` (port 3000)

## Features
- Section-specific accent colors:
  - Main: Teal (#14b8a6)
  - /admin: Orange (#f59e0b)
  - /tails: Lavender Purple (#a78bfa)
- Neon glow effects (60% opacity)
- Desktop sidebar navigation (tree-style icons)
- Mobile slide-out drawer

## Pages (14 + 8 utilities + admin)
- /, /about, /portfolio, /blog, /guestbook, /now, /uses, /contact, /tails
- /utilities/* (8 tools)
- /admin, /admin/dashboard
- /api/admin/*, /api/guestbook, /rss.xml

## Key Components
- TerminalWindow: Terminal-style container
- SectionContext: Auto-switches colors by URL
- Navigation: Sidebar + mobile drawer
- TypingEffect, NeonText: Animation components

## Hidden Features
- /tails - Easter egg page (fastfetch style ASCII art), access via direct link or from ~/now, ~/uses

## Admin Authentication
- bcrypt hashed password stored in env var
- Environment variable: `NEXT_PUBLIC_ADMIN_PASSWORD_HASH`
- Default login page: /admin

## Run Commands
- Build: `npm run build`
- Dev: `npm run dev`
- Lint: `npm run lint` (if available)

## Content Files
- src/content/profile.json - Profile, social links, uses, tails stats
- src/content/projects.json - Portfolio projects
- src/content/skills.json - Skills by category
- src/content/guestbook.json - Guestbook entries
- src/content/blog/*.mdx - Blog posts (MDX format)