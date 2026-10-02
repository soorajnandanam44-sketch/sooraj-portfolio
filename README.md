# Sooraj Somarajan — Graphic & Motion Design Portfolio

Complete static website for GitHub Pages. No build command, paid service, API key, framework, or npm installation is needed.

## Publish with GitHub Pages

1. Unzip the download and open the `sooraj-portfolio` folder.
2. Create a GitHub repository, for example `portfolio`.
3. Upload **everything inside this folder**, including the `assets` folder. `index.html` must be at the repository root, not inside another folder. Upload the extracted files, not the ZIP.
4. Commit the files to the `main` branch.
5. Open **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, select **main** and **/ (root)**, then click **Save**.
6. GitHub displays the published URL in that Pages screen when deployment finishes.

The `.nojekyll` file is included for static publishing. The asset paths are relative, so the same code supports a user site or a project repository without changing a base URL. This download has not been uploaded to your GitHub account.

Official publishing instructions:
https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Preview on your computer

Double-click `index.html` to open the website. For a local server, open a terminal in this folder and run:

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000. On Windows, `py -m http.server 8000` may be the available Python command.

## What is included

- Latest seated portrait with the head size adjusted between the two previous versions.
- Hero orbit animation, pointer interaction and small docked identity.
- Draggable project gallery with grid view and project/video dialogs.
- Motion showreel and connected design-discipline orbits.
- Front-end and art-direction card decks; JavaScript and Three.js marked **Learning**.
- Blender, Premiere Pro and the repaired DaVinci Resolve card; final cream transition removed.
- Separate AI Toolkit: Kling, Higgsfield AI, Claude, ChatGPT and Weave AI.
- About, secondary website projects, and email contact sections.
- Relative image/font paths for GitHub Pages, reduced-motion options and responsive styles.

This export also prevents the AI section from scrolling the page on initial load and restores card access when choosing “View all tools”.

## Edit the site

| File | Purpose |
| --- | --- |
| `index.html` | Page sections, navigation, text, tool cards and contact links |
| `projects.js` | Project names, images, categories, descriptions and video URLs |
| `styles.css` | Main page layout, portrait placement, colours and responsive styling |
| `toolkit.css` | Both toolkit sections and card styling |
| `app.js` | Project filters, dialogs, video handling and motion controls |
| `interactions.js` | Hero motion, cursor, project gallery, connections and scroll effects |
| `toolkit.js` | Front-end/art-direction card fan and flip sequence |
| `ai-toolkit.js` | Separate AI toolkit animation |
| `assets/` | Bundled images, card artwork and toolkit font |

Open the entire folder in Antigravity, VS Code or another editor. Preserve the relative paths when renaming files.

The current hero is `assets/sooraj-seated-balanced.png`. It is an AI-created studio portrait. Change both its image and preload references in `index.html` if you replace it. The final `.hero-seated` rules in `styles.css` control its scale and placement.

## Project videos

All site code, still images, toolkit artwork and the font are bundled. The seven video files are **linked, not included**: the video URLs in `projects.js` use your existing `https://my-portfolio-e4rk.vercel.app` site. Keep that host online for playback. Each video also has its existing Playbook fallback link.

To host your own copies, put compressed MP4 files in `assets/videos/` and change the corresponding `video` values to relative paths such as `assets/videos/showreel.mp4`. An HTTPS video host can also be used. Video playback needs an internet connection while these links are external.

## Design references and assets

Gravity informed the hero layout and orbital interaction direction. Guillaume Zhu’s toolkit informed the card fan sequence, and its original software card SVGs and Cabinet Grotesk font are included. The newer Blender, Premiere Pro, DaVinci Resolve and AI cards were made for this portfolio. Project stills and video links came from your existing portfolio.

## Validation

The export checks JavaScript syntax, local HTML/CSS/project asset references, section IDs, SVG parsing, ZIP integrity and serving from a GitHub-style subdirectory. It is compatible static source, not an automated pixel-perfect verification of the design references. Live GitHub deployment and browser video playback have not been performed for this download.
