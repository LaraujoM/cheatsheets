# cheatsheets

A personal collection of CLI command references I keep looking up.

Built with SvelteKit and deployed on Cloudflare Pages. Content is driven by YAML files so adding new commands is just editing a file.

**Live at [cheatsheet.laraujo.com](https://cheatsheet.laraujo.com)**

## Adding commands

Each category is a YAML file in `content/`:

```yaml
category: curl
icon: 🌐
description: Transfer data with URLs
commands:
  - name: POST JSON
    command: 'curl -X POST https://api.example.com -H "Content-Type: application/json" -d ''{"key": "value"}'''
    description: POST request with a JSON body
    tags: [post, json]
```

Add a new file for a new category. That's it.

## Running locally

```bash
npm install
npm run dev
```

## Stack

- SvelteKit (static)
- YAML for content
- Cloudflare Pages for hosting
