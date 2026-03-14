# Project Index

## Overview

- Project type: static personal portfolio site
- Main entry point: `index.html`
- Active stylesheets: `Css_Files/Style.css`, `Css_Files/mediaqueries.css`
- Referenced script: `script.js` (missing)
- Primary asset directory: `Assets/`

## Root Structure

```text
.
|-- index.html
|-- PROJECT_INDEX.md
|-- .hintrc
|-- .gitattributes
|-- Css_Files/
|   |-- Style.css
|   |-- mediaqueries.css
|   |-- General.css
|   |-- Header.css
|   |-- Introduction.css
|   `-- AboutSection.css
`-- Assets/
    |-- HK.png
    |-- Harsha Karteek Resume .pdf
    |-- linkedin.png
    |-- github.png
    |-- email.png
    |-- experience.png
    |-- education.png
    |-- checkmark.png
    `-- arrow.png
```

## Application Entry

### `index.html`

- Loads `Css_Files/Style.css`
- Loads `Css_Files/mediaqueries.css`
- Defines the full page structure and content
- References `script.js` near the end of the document, but that file is not present

## Page Sections

### Navigation

- Desktop nav: `#desktop-nav`
- Mobile nav: `#hamburger-nav`
- Mobile menu depends on `toggleMenu()`, which is not defined in the repo

### `#profile`

- Hero section with profile image, title, CTA buttons, and social icons
- Resume button points to `./assets/Harsha Karteek Resume .pdf`

### `#about`

- About headline, profile image, experience/education cards, and summary text

### `#experience`

- Two skill cards
- First card: frontend skills
- Second card is labeled "Frontend Development" but contains backend/tooling items

### `#projects`

- Three placeholder project cards
- Expects `project-1.png`, `project-2.png`, and `project-3.png` in assets, but none exist

### `#contact`

- Email and LinkedIn contact links

### Footer

- Repeats the main nav links
- Footer copyright still says `John Doe`

## Styling Map

### `Css_Files/Style.css`

- Base reset and typography
- Desktop navigation and hamburger menu styling
- Shared section layout
- Profile, about, experience, projects, contact, and footer styles

### `Css_Files/mediaqueries.css`

- Breakpoints at `1400px`, `1200px`, and `600px`
- Switches from desktop to hamburger navigation below `1200px`
- Reduces section dimensions and wraps layouts for narrow screens

### Unused or Unlinked CSS Files

- `Css_Files/General.css`
- `Css_Files/Header.css`
- `Css_Files/Introduction.css`
- `Css_Files/AboutSection.css`

These files are present in the repo but are not linked from `index.html`.

## Assets

### Present

- `HK.png`
- `Harsha Karteek Resume .pdf`
- `linkedin.png`
- `github.png`
- `email.png`
- `experience.png`
- `education.png`
- `checkmark.png`
- `arrow.png`

### Missing but Referenced

- `project-1.png`
- `project-2.png`
- `project-3.png`
- `script.js`

## Configuration

### `.hintrc`

- Extends the `development` preset
- Disables some viewport and accessibility-related hints

## Current Integrity Issues

- Asset path casing is inconsistent: the repo uses `Assets/`, but many references use `./assets/...`
- `script.js` is referenced but missing
- `toggleMenu()` is referenced but missing
- Project preview images are referenced but missing
- Social links still point to generic LinkedIn and GitHub URLs
- Hamburger nav logo still says `John Doe`
- Footer copyright still says `John Doe`

## Recommended Next Fixes

- Add or remove the missing `script.js` dependency
- Normalize all asset paths to `Assets/...`
- Replace placeholder project images and links
- Replace remaining `John Doe` placeholders
- Decide whether the extra CSS files should be linked, merged, or deleted
