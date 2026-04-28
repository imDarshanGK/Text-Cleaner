# Text Cleaner

A simple browser-based tool to clean and transform text quickly.

## Features

- Live input character and word count
- Live output word count
- Actions: Clean Text, Fix Case, Make Bullets, Remove Symbols, Reset
- Optional Auto Clean while typing
- Optional Keep original line breaks
- One-step Undo Last Action
- Paste from clipboard
- Copy output with temporary "Copied!" feedback
- Download output as `.txt`
- Clear output
- Dark/Light theme toggle
- Disabled actions when no text is available

## Run

1. Run a local server from this folder, for example:

	```bash
	python3 -m http.server 5500
	```

2. Open `http://localhost:5500` in a browser.
3. Type or paste text in the input area.
4. Use the action buttons to process text.

No build step or dependencies are required.

## Deploy

Recommended simple options for deploying this static app:

- GitHub Pages (automatic): I added a GitHub Action that publishes the repository root on every push to `main`. Enable Pages in the repo settings if required; the workflow will create/update the Pages site automatically.
- Vercel: Connect the repo to Vercel and it will deploy automatically (good for previews and branches).
- Netlify: This repo now includes `netlify.toml`, so you can connect the GitHub repo to Netlify and deploy the site with `publish = "."`.
- Surge: Quick single-command deploys for static folders.

If you want, I can also add a Netlify redirect file or a custom domain config next.