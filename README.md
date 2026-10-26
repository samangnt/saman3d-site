# Saman3D — Stories with dimension.

[![Website](https://img.shields.io/badge/Website-saman3d.com-aaa6ff)](https://saman3d.com/)
![Stack](https://img.shields.io/badge/Stack-HTML%20%C2%B7%20CSS%20%C2%B7%20JavaScript-303138)
![Powered by GPT Sol](https://img.shields.io/badge/Powered%20by-GPT%20Sol-aaa6ff)

The portfolio of Saman: a 3D artist, animator and game developer with **5 years of experience**. Built around real project artwork, animated films, character galleries and interactive worlds.

Saman3D is a next-generation production studio bridging high-fidelity 3D animation, standalone indie games, and interactive Roblox experiences. We leverage advanced AI reasoning models to eliminate bottlenecks, automate heavy DCC workflows, and scale our output.

## Explore

- Filter 11 projects by short-form, cinematic, cartoon, character modelling or game development, or search by title and project details.
- Open videos in an accessible project dialog, with credits and a direct YouTube fallback.
- Browse 31 recovered character images in two galleries using arrows, thumbnails or the keyboard.
- Explore the Emergency Route development preview, biography and services.
- Copy the contact email or share a direct project link such as `https://saman3d.com/#project=chasms-call`.
- Use the responsive mobile menu, keyboard navigation and reduced-motion support.

Portfolio videos, imagery and credits were recovered from [the original portfolio](https://sites.google.com/view/samanx3d/home). Original image watermarks are retained. Additional work listed in the biography has no supplied media and is credited in text rather than presented with invented imagery.

## Run locally

No package installation, build system or API keys are required. From this folder:

```sh
python -m http.server 4173 --bind 127.0.0.1
```

Open `http://127.0.0.1:4173/`. Stop the server with Ctrl+C when finished.

## Update the portfolio

- `portfolio.js`: project titles, media, categories, descriptions, roles and galleries.
- `index.html`: permanent page sections and the initial project cards. Update the matching card when changing project data, so links remain useful without JavaScript.
- `style.css`: responsive layout and appearance.
- `app.js`: filtering, search, viewers, copy actions and navigation.
- `images/portfolio/`: optimized local copies of the recovered project artwork and video posters.
- `CNAME`: the existing `saman3d.com` custom domain; preserve it.

The first six projects appear initially; **Explore all 11 projects** reveals the rest. Category filters and search examine the complete collection. Without JavaScript, every card is shown and links work directly.

## Hosting

This remains a static GitHub Pages site using the existing custom domain. Merging the review branch into the configured publishing branch can update the public website.

## Credits

Artwork and project credits belong to Saman and the respective credited clients. The redesign and interactive website implementation were made with **GPT Sol**. This is a development credit; the website does not call an AI service at runtime.

[Instagram](https://www.instagram.com/samanx3d/) · [LinkedIn](https://www.linkedin.com/in/samanx3d/) · [Email](mailto:saman@saman3d.com)
