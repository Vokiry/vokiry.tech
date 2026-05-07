# vokiry.tech - Personal Developer Site

A personal portfolio website with developer utilities and blog.

## Overview

- **Domain**: vokiry.tech
- **Stack**: Next.js 16 (App Router), TypeScript, Tailwind CSS
- **Status**: Active development

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home - Hero, $ fastfetch, featured projects, recent posts, quick utilities |
| `/about` | About page with dynamic content from profile |
| `/portfolio` | Projects showcase - dynamic from projects.json |
| `/blog` | Blog posts listing (file-based MDX) |
| `/blog/[slug]` | Individual blog post |
| `/utilities` | Developer tools (8 tools) |
| `/contact` | Contact page with dynamic social links |
| `/uses` | Hardware and software - dynamic from profile |
| `/now` | Current projects and focus - dynamic from profile |
| `/tails` | Play on Unix `tail` command - red panda stats |
| `/guestbook` | Visitor messages |
| `/admin` | Admin panel login |
| `/admin/dashboard` | Content management dashboard |
| `/rss.xml` | RSS feed for blog posts |
| `/sitemap.xml` | SEO sitemap for search engines |
| `/robots.txt` | Crawler instructions |
| `/404` | Custom not found page |

## Design

- **Theme**: Dark mode with teal accents (#14b8a6)
- **Style**: Glassmorphism cards, terminal-inspired elements
- **Typography**: Geist Sans + JetBrains Mono
- **Animations**: CSS fade-in animations

### Terminal Features
- `$ whoami` - Username display
- `$ fastfetch` - System info with red panda ASCII art
- `$ cat fursona.txt` - Red panda fursona info
- `/tails` - Stats page with progress bars

### Mobile
- Responsive navigation with hamburger menu
- Touch-friendly buttons

## Commands

```bash
# Development
npm run dev

# Production build
npm run build

# Production server
npm start

# Linting
npm run lint
```

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── admin/           # Admin panel
│   │   ├── page.tsx    # Login page
│   │   └── dashboard/ # Dashboard
│   ├── api/            # API routes
│   │   ├── admin/      # Admin API (posts, projects, skills, profile)
│   │   └── guestbook/ # Guestbook API
│   ├── blog/
│   ├── about/
│   ├── contact/
│   ├── guestbook/
│   ├── now/
│   ├── portfolio/
│   ├── tails/
│   ├── uses/
│   ├── utilities/
│   └── ...
├── components/         # React components
├── lib/                # Utilities
│   ├── posts.ts        # Blog post management
│   ├── projects.ts     # Projects CRUD
│   ├── skills.ts       # Skills CRUD
│   ├── profile.ts      # Profile data
│   └── guestbook.ts    # Guestbook CRUD
└── content/            # Content storage
    ├── blog/           # MDX blog posts
    ├── projects.json   # Portfolio projects
    ├── skills.json    # Skills by category
    ├── profile.json   # All profile data
    └── guestbook.json # Guestbook messages
```

## Utilities (8 Tools)

1. **JSON Formatter** - Format and validate JSON
2. **Base64 Encoder/Decoder** - Encode and decode Base64
3. **URL Encoder/Decoder** - Encode and decode URLs
4. **Hash Generator** - Simple hash generation
5. **Color Converter** - Convert between HEX, RGB, HSL
6. **Timestamp Converter** - Unix timestamps to human readable
7. **Cron Expression Parser** - Parse cron and show next runs
8. **SQL Formatter** - Pretty-print SQL queries

## Content Storage

### projects.json
```json
[
  {
    "slug": "project-alpha",
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

### skills.json
```json
[
  {
    "category": "Frontend",
    "proficiency": "Expert",
    "items": ["React", "Next.js", "TypeScript"]
  }
]
```

### profile.json
```json
{
  "about": {
    "whoAmI": "...",
    "whatIDo": "...",
    "fursona": { "species": "Red Panda", "colors": ["teal", "cyan", "red"] }
  },
  "now": [
    { "item": "Project", "description": "..." }
  ],
  "uses": {
    "hardware": ["MacBook Pro"],
    "software": ["VS Code"]
  },
  "tails": {
    "status": "fluffy",
    "location": "somewhere warm",
    "tailLength": 60,
    "energy": 80,
    "napsToday": 50,
    "bamboo": 90
  },
  "social": {
    "github": "https://github.com/username",
    "twitter": "https://twitter.com/username",
    "linkedin": "https://linkedin.com/in/username",
    "email": "hello@vokiry.tech"
  }
}
```

## Admin Panel

### Access
- **URL**: `/admin`
- **Password**: `Vokiry_SHkiper.758`
- **Session**: Expires after 1 hour

### Dashboard Tabs

**Posts**
- View all blog posts
- Create new post (title, excerpt, tags, markdown)
- Delete posts

**Projects**
- View all projects
- Create new project
- Edit existing project
- Toggle featured
- Delete project

**Skills**
- View all skill categories
- Add new category
- Edit category (name, proficiency, items)
- Delete category
- Proficiency levels: Expert, Advanced, Intermediate, Beginner

**Profile**
- Edit About section (Who I Am, What I Do)
- Edit Social links (GitHub, Twitter, LinkedIn, Email)
- Edit Uses - Hardware (one per line)
- Edit Uses - Software (one per line)
- Edit Tails Stats (status, location, tailLength%, energy%, napsToday%, bamboo%)

### Bug Fixes Applied
- Base64 encode/decode now works correctly
- Guestbook messages load properly
- Tails ASCII art formatted correctly

## Guestbook

- **URL**: `/guestbook`
- Visitors can leave name and message
- Messages stored in guestbook.json
- Managed via admin dashboard

## SEO

- **Sitemap**: `/sitemap.xml`
- **Robots**: `/robots.txt` - blocks `/admin`
- **RSS**: `/rss.xml`

---

Last updated: May 2026