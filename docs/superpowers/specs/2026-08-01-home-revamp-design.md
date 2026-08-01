# Design Spec — Interfaces Home Revamp
Date: 2026-08-01

## Goal

Reframe the home from a passive portfolio ("a collection of interfaces") to an active artistic declaration ("an ongoing ecosystem of browser-based musical instruments"). No visual redesign — same monospace aesthetic, same warm beige palette, same grid/modal system. Only the header zone changes.

## What Changes

### index.html — Header zone

Replace the current `<p class="sub">` with an expanded `.intro` block containing three elements:

1. **Declaration line** — the new tagline, bilingual
2. **Context paragraph** — 3 sentences, bilingual, with a dynamic instrument count injected by JS
3. **Links line** — author attribution + social links + POSNETES

**EN:**
```
An ongoing ecosystem of browser-based musical instruments.

Gestures, text, pixels, algorithms, weather, clocks —
each instrument proposes a different interaction model
as raw material for sound and image.
[N] works. No installation. Nothing but a browser.

by vlasvlasvlas · instagram ↗ · github ↗
Also performed live within POSNETES ↗
```

**ES:**
```
Un ecosistema vivo de instrumentos musicales para navegador.

Gestos, texto, píxeles, algoritmos, clima, relojes —
cada instrumento propone un modelo de interacción distinto
como materia prima para sonido e imagen.
[N] obras. Sin instalación. Solo un navegador.

por vlasvlasvlas · instagram ↗ · github ↗
También en performance en vivo dentro de POSNETES ↗
```

### app.js — Dynamic count

After loading the YAML data, inject the total instrument count (`allProjects.length`) into a `<span id="instrument-count">` inside the context paragraph. This keeps the number accurate as instruments are added.

The existing `switchLang()` function updates the intro text along with the rest of the page.

### styles.css — New intro styles

- `.intro-declaration` — slightly larger than body text, `#333`, not bold
- `.intro-context` — same size as body, `#555`, `line-height: 1.65`
- `.intro-links` — `font-size: 13px`, `color: #888`, links in same style as existing `a` tag
- Add `margin-bottom: 20px` to `.intro` to match the existing `hr` rhythm

## Links

| Label | URL |
|---|---|
| vlasvlasvlas instagram | https://www.instagram.com/vlas.vlas.vlas |
| vlasvlasvlas github | https://github.com/vlasvlasvlas |
| POSNETES | https://www.instagram.com/posnetes |

## What Does NOT Change

- The `<hr>` separator
- Filter buttons and behavior
- Grid layout and cards
- Modal and embed system
- Bilingual toggle logic (extended to cover new text)
- Mobile breakpoints (the intro text is already responsive by being plain text)

## CAN Submission Text

**Project Description:**
> Interfaces is an ongoing ecosystem of browser-based musical instruments and audiovisual works that investigate the expressive and performative possibilities of the open web.
>
> Rather than treating the browser as a passive display, each instrument proposes a distinct interaction model: gestures, text, images, algorithms, clocks, weather data, and pixels become raw material for sound and visual composition. No installation required — only a browser.
>
> Now comprising over forty self-contained works, Interfaces is both an independent artistic project and the live performance foundation for POSNETES — an electroacoustic project where browser-based instruments perform alongside modified payment terminals, motors, resonant objects, and custom-built electronics.
>
> The ecosystem continues to grow.

**Technical Info:**
> Built with vanilla JavaScript, HTML5 and CSS using the Web Audio API and HTML5 Canvas. Individual works incorporate WebGL, MIDI, webcam input, browser sensors, procedural graphics, generative audio, FFT analysis, image processing, and algorithmic composition. No frameworks, no installation — browser-native instruments that run across desktop and mobile.
