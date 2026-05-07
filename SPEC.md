# vokiry.tech - Personal Developer Site Specification

## Overview

- **Domain**: vokiry.tech
- **Purpose**: Portfolio + Utilities + Blog
- **Target users**: Recruiters, fellow developers, general users needing tools

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **Content**: MDX for blog posts
- **Deployment**: Docker (planned)
- **Package Manager**: npm

## Design System

### Colors

```css
--primary: #14b8a6        /* Teal-500 */
--primary-dark: #0d9488   /* Teal-600 */
--primary-light: #2dd4bf  /* Teal-400 */

--bg-primary: #0a0a0a    /* Near black */
--bg-secondary: #0f0f0f   /* Dark gray */
--bg-card: #171717        /* Card background */
--bg-card-hover: #1f1f1f  /* Card hover */

--text-primary: #fafafa   /* White-ish */
--text-secondary: #a1a1aa /* Gray-400 */
--text-muted: #71717a     /* Gray-500 */

--accent-cyan: #06b6d4   /* Cyan-500 */
--accent-green: #22c55e  /* Green-500 */

--border: #262626         /* Gray-800 */
--border-hover: #404040   /* Gray-700 */
```

### Typography

- **Headings**: Geist (from Google Fonts)
- **Body**: Geist
- **Code/Terminal**: JetBrains Mono

### Visual Style

- Dark theme default
- Terminal-inspired elements
- Glassmorphism cards with backdrop-blur
- Code blocks with monospace text

## Pages & Features

### / (Home)

- Hero section with name and tagline
- Featured projects (filtered from projects.json where featured=true)
- Recent blog posts
- Quick utility links
- Navigation links

### /about

- Dynamic content from profile.json
- Who I Am section
- Fursona info (species, colors)
- What I Do section
- Links to /now, /uses, /tails

### /portfolio

- Projects grid from projects.json
- Project title, description, tech stack
- Live Demo and GitHub links
- Featured badge
- Skills section (still static for now)

### /utilities

Developer tools:
- JSON Formatter
- Base64 Encoder/Decoder
- URL Encoder/Decoder
- Hash Generator
- Color Converter (HEX, RGB, HSL)
- Timestamp Converter
- Cron Expression Parser
- SQL Formatter

### /blog

- Blog posts list (MDX files in /content/blog/)
- Individual post pages with markdown rendering

### /contact

- Dynamic social links from profile.json
- GitHub, Twitter, LinkedIn, Email

### /uses

- Hardware list from profile.json
- Software list from profile.json

### /now

- Current focus items from profile.json

### /tails

- Red panda themed stats page
- Stats from profile.json:
  - status, location
  - tail_length %
  - energy %
  - naps_today %
  - bamboo %

### /guestbook

- Visitor messages
- Public signable guestbook
- Form to submit name and message

## Content Storage

### /src/content/projects.json
```json
[
  {
    "slug": "project-slug",
    "title": "Project Name",
    "description": "Description",
    "tech": ["React", "Next.js"],
    "live": "https://...",
    "github": "https://...",
    "featured": true,
    "order": 1
  }
]
```

### /src/content/skills.json
```json
[
  {
    "category": "Frontend",
    "proficiency": "Expert",
    "items": ["React", "Next.js"]
  }
]
```

### /src/content/profile.json
```json
{
  "about": {
    "whoAmI": "...",
    "whatIDo": "...",
    "fursona": { "species": "Red Panda", "colors": ["teal", "cyan", "red"] }
  },
  "now": [{ "item": "...", "description": "..." }],
  "uses": { "hardware": [...], "software": [...] },
  "tails": { "status": "...", "location": "...", "tailLength": 60, "energy": 80, "napsToday": 50, "bamboo": 90 },
  "social": { "github": "...", "twitter": "...", "linkedin": "...", "email": "..." }
}
```

### /src/content/guestbook.json
```json
[
  { "id": "1", "name": "Visitor", "message": "Hello!", "date": "2026-05-08" }
]
```

## Admin Dashboard

Access: `/admin` with password `Vokiry_SHkiper.758`

### Tabs:

**Posts**
- View, create, delete blog posts

**Projects**  
- View, create, edit, delete projects
- Toggle featured flag

**Skills**
- View, create, edit, delete skill categories
- Proficiency levels: Expert, Advanced, Intermediate, Beginner

**Profile**
- Edit About (whoAmI, whatIDo)
- Edit Social links
- Edit Uses (hardware, software - one per line)
- Edit Tails Stats

## API Routes

- `/api/admin/posts` - CRUD for blog posts
- `/api/admin/projects` - CRUD for projects  
- `/api/admin/skills` - CRUD for skills
- `/api/admin/profile` - Get/update profile
- `/api/guestbook` - Get/add guestbook entries
- `/rss.xml` - RSS feed
- `/sitemap.xml` - Sitemap
- `/robots.txt` - Robots.txt

## Bugs Fixed

- Base64 encode/decode mode switching
- Guestbook message loading (useState → useEffect)
- Tails ASCII art formatting
- Self-closing textarea tags

---

Last updated: May 2026