# hurra.family-website
## Overview

This repository is a personal website project. It's intended for self-hosting on a custom domain and as a playground to learn and use JavaScript Web Components (native custom elements, Shadow DOM, templates and slots). Code is focused on small, reusable components and simple static deployment.

## Goals

- Personal site hosted on my own domain.
- Experiment with modern browser capabilities (Web Components) without a heavy framework.
- Keep components encapsulated, testable, and easy to compose.

## Getting started (brief)

- Serve the repository statically (e.g., `http-server`, `python -m http.server`, `nginx`) and open the site in a modern browser.
- No build step required for basic usage; optional bundling for production.
- Note: I have custom aliases in `nginx` to handle links. Update links according to your needs.

## Web Components — quick summary

Web Components are browser standards for encapsulated, reusable UI:
- Custom Elements: new HTML tags with lifecycle callbacks (connectedCallback, disconnectedCallback, attributeChangedCallback).
- Shadow DOM: encapsulated DOM and styles to avoid leaking or being affected by page CSS.
- HTML Templates: declarative markup cloned into components.
- Slots: insertion points to project markup into a component.
- Attributes/Properties & Events: public API for configuration and communication.
- Pattern used here: a template + shadow root per component, exposing attributes/properties and dispatching custom events.

## Components (structure & notes)

Each entry lists the component purpose, structure, public API and the expected JS file name.

Component: header
- File: header.js
- Purpose: Site header with branding and navigation.
- Structure: Shadow root with branding and navigation elements.
- Notes: Responsive design and keyboard accessibility.

Component: section
- File: section.js
- Purpose: Wrapper for page sections with optional heading.
- Structure: Template with heading and content slots.
- Notes: Lightweight and consistent spacing.

Component: card-grid
- File: card-grid.js
- Purpose: Container for a grid of cards.
- Structure: Shadow root with grid layout for cards.
- Notes: Presentational and supports dynamic card generation.

Component: card
- File: card.js
- Purpose: Content card for displaying previews.
- Structure: Shadow root with image, title, and action area.
- Notes: Accessible and supports lazy-loading.

Component: hero
- File: hero.js
- Purpose: Hero section with background media.
- Structure: Shadow root with slots for title and call-to-action.
- Notes: Semantic content and minimal JavaScript.

Component: footer
- File: footer.js
- Purpose: Footer with copyright and links.
- Structure: Shadow root with copyright and link slots.
- Notes: Focus on accessibility and minimal logic.

## License
Personal project — currently no licensing.