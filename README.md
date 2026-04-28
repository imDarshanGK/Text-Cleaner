# Text Cleaner

> A calm, focused text cleanup tool for quick paste, clean, copy workflows.

Live demo: https://cletrix.netlify.app/

Text Cleaner is a static browser app with a split workspace: input on the left, a centered clean action, and output on the right. It is designed for the simple flow of **open → paste → click → done**.

## Highlights

- Clean Text
- Fix Case
- Remove Symbols
- Make Bullets
- Paste from clipboard
- Clear Input
- Copy output with `Copied ✓` feedback
- Download cleaned text as `.txt`
- Clear Output

## How it works

1. Paste or type text into the input panel.
2. Use the large `Clean Text` button or one of the smaller text actions.
3. Review the result in the output panel.
4. Copy, download, or clear the output when you are done.

## Layout

- Left: input area with small helper tools
- Center: primary action rail with `Clean Text`
- Right: output area with copy, download, and clear buttons
- Mobile: the panels stack vertically for a narrow screen

## Run locally

1. Start a local server from this folder:

   ```bash
   python3 -m http.server 5500
   ```

2. Open `http://localhost:5500` in your browser.
3. Paste some text and try the actions.

No build step or dependencies are required.

## Tech

- HTML
- CSS
- Vanilla JavaScript

## Deploy

This repo is ready for simple static hosting:

- GitHub Pages: a workflow can publish the repository root on pushes to `main`.
- Netlify: `netlify.toml` points the publish directory at the repo root.

## Project files

- `index.html` - app layout
- `styles.css` - dark UI styling
- `script.js` - text actions and button behavior

## Live App

Text Cleaner is deployed on Netlify:

- https://cletrix.netlify.app/