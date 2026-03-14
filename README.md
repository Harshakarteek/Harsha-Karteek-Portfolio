# Harsha Karteek Portfolio

Static portfolio site with separate pages for Game Development and Web Development.

## Pages

- `index.html`: landing page with the two portfolio paths
- `game.html`: game development page
- `web.html`: web development page

## Content editing

You do not need to edit the HTML for normal text changes.

Edit this file instead:

- `content/site-content.json`

That file controls:

- hero text
- about text
- featured project copy
- project cards
- skill blocks
- contact labels

## Run locally

Because the site loads content through `fetch()`, open it with a local static server instead of double-clicking the HTML file.

Examples:

- `npx serve .`
- VS Code Live Server

## Deploy to GitHub Pages

1. Push the repository to GitHub.
2. Open repository `Settings`.
3. Open `Pages`.
4. Set source to `Deploy from a branch`.
5. Select your main branch and `/ (root)`.
6. Save and wait for deployment.

## Google Sheets option

Yes, this can be made editable from Google Sheets later.

Recommended path:

1. Keep the current JSON structure as the content format.
2. Publish a Google Sheet or use Google Apps Script to expose the sheet as JSON.
3. Replace the `fetch("content/site-content.json")` call in `app.js` with your published sheet endpoint.

That way you can update portfolio text from a sheet without touching the code.
