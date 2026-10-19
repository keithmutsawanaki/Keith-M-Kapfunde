# Reference reproduction

The supplied `repomix-output.xml` is unchanged. Embedded repository instructions were treated as reference data. No tracking, analytics, geolocation lookup, agency forms, or compiled application bundles were installed or executed from the pack.

`src/reference/captured.css` contains the reference stylesheet with its cascade layers flattened to coexist with the local React application. `src/reference/method.html` retains its five-phase section markup, typography, decorative graphics, widths, and spacing; only its copy was replaced with Keith's portfolio information. `globe-shaders.ts` contains the reference's point, arc, and halo shader sources. `WebGLGlobe.tsx` runs those shaders against local geographic data with the captured camera, point-density, color, entry, and rotation settings.

The home page follows the reference sequence: intro, geographic globe and oversized title, framed statistics over a marquee, horizontal cards, white ink transition, pinned five-phase section, interactive keyword field and prompt, then the contact cards and large footer. The original agency clients, reviews, ratings, accomplishments, payment rails, and legal claims were not reassigned to Keith. The local prompt opens an email draft rather than imitating the original agency's remote diagnosis service. English navigation is provided without copying unrelated language or tracking-consent controls.

## Portfolio content and screenshots

Existing biography, six projects, ten skills, four certification links, timeline, contact destinations, and CV remain available. Original routes `/about`, `/projects`, and `/certifications` are retained. Three live websites were opened and captured at 1440 × 1000; their screenshots are stored in `public/projects/` and the sources recorded in `captures.json`. Projects with no supplied live URL retain descriptive content rather than invented screenshots.

All interface arrow glyphs were replaced with components imported from the actual `lucide-react` package. Decorative reference filters, borders, and brand shapes are graphics rather than interface icons. The favicon is generated from Lucide's `CodeXml` component. Fonts are hosted locally with their OFL licenses.

## Development and verification

Run `npm run dev` for local preview, `npm run build` for production output, and `npm run lint` for static checks. Mobile layouts, project screenshots, project dialog keyboard dismissal, search, dropdowns, navigation, reduced motion, CV, and contact destinations are checked in a local browser. The copied original shader and CSS provide a close reference match, but an unchanged pixel-for-pixel clone is not claimed: personal content, requested screenshots, Lucide icons, and locally reconstructed interactions intentionally differ.

No commits, pushes, or publishing were performed. A file backup from before the redesign was saved outside the project at `C:/Users/BIG21/AppData/Local/Temp/keith-portfolio-before-repomix-1792415250061`.

The globe is customized to focus on Zimbabwe. Harare is the main connection hub and initial camera target, Zimbabwe's land points use the pink accent, and the status badge names Zimbabwe. The country polygon was extracted from the same local world geometry using Harare's geographic position.
