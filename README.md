# Grit Nexted Fitness Studio
Mayerfeld Practicum Team 2 assignment upgraded:
HTML5 + CSS3 (No Framework) -> ReactJS + Vite + TailwindCSS -> ReactJS + NextJS + PostgreSQL

## Version
-v2.1.0

## Tech Stack
- React JS
- TailwindCSS
- NextJS

## Project map

```text
.
├── public/                 # Static assets
├── prisma/
│   ├── schema.prisma       # Data model
│   └── migrations/...
├── src/
│   ├── app/
│   │   ├── api/...
│   │   ├── layout.js
│   │   └── page.js
│   ├── components/...
│   ├── contexts/...
│   ├── data/...
│   ├── generated/...
│   └── lib/...
├── .gitignore
└── package.json
```

This layout keeps the app, API, shared UI, and database pieces easy to find. The `...` marks the parts best discovered while exploring.

Local environment files are excluded from Git.