`# Design System Strategy: The Kinetic Canvas

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Kinetic Canvas."** We are moving beyond the static "Lime and White" template to create a high-energy, editorial experience that feels like it’s in constant, fluid motion. 

The goal is to harness the natural vibrance of Lime Green (#32CD32) not as a mere accent, but as a light source that illuminates a sophisticated, layered white environment. By utilizing intentional asymmetry, oversized typography scales, and a departure from rigid "boxy" containers, we create a UI that feels premium, professional, and undeniably modern. This is not a flat website; it is an organized, high-velocity digital editorial.

---

## 2. Colors: The High-Energy Palette
We use a Material-derived tonal palette to ensure the Lime Green has the depth required for professional applications.

### Color Roles
- **Primary (`#006b0a`):** Used for high-emphasis actions. Note that for accessibility on light backgrounds, we use a deepened forest-lime to ensure contrast.
- **Primary Container (`#59ee50`):** This is your "Vibrant Lime." Use this for hero accents and secondary buttons.
- **Surface & Background (`#f1f8f1` to `#ffffff`):** A crisp, ultra-clean base.
- **Tertiary (`#00666d`):** A deep teal-green used sparingly to provide "visual weight" and prevent the layout from feeling too "neon."

### The "No-Line" Rule
**Strict Mandate:** 1px solid borders are prohibited for sectioning or containment. 
Boundaries must be defined solely through background shifts. Use `surface-container-low` for a section sitting on a `surface` background. If you need to separate content, use white space (Spacing 8 or 12) rather than a line.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. 
- **Base:** `surface` (#f1f8f1)
- **Sectioning:** `surface-container-low` (#ebf3eb)
- **Interactive Cards:** `surface-container-lowest` (#ffffff)
This nesting creates a "soft lift" that feels architectural rather than templated.

### The "Glass & Gradient" Rule
To elevate the "out-of-the-box" feel:
- **Signature Gradients:** Use a linear gradient from `primary` (#006b0a) to `primary-container` (#59ee50) at a 135-degree angle for main Hero CTAs.
- **Glassmorphism:** For floating navigation or modals, use `surface-container-lowest` at 80% opacity with a `24px` backdrop-blur.

---

## 3. Typography: Inter Editorial
We use **Inter** with a high-contrast scale to create an authoritative, editorial feel.

- **Display (LG: 3.5rem / MD: 2.75rem):** Set with `-0.04em` letter spacing and `bold` weight. Use these for high-impact statements.
- **Headlines (LG: 2rem):** Used for section titles. Always pair with a Lime Green accent (like a `primary-fixed` small square or dot) to anchor the eye.
- **Body (LG: 1rem):** Use `on-surface-variant` (#565d58) for long-form text to reduce eye strain against the crisp white background.
- **Labels (MD: 0.75rem):** Use `semibold` and uppercase for category tags to provide a "functional" contrast to the organic layout.

---

## 4. Elevation & Depth: Tonal Layering
Traditional drop shadows are too "heavy" for this system. We achieve depth through **The Layering Principle.**

- **Ambient Shadows:** When a card must float, use a shadow with a 40px blur, 0px offset, and 6% opacity of the `on-surface` color. It should feel like a soft glow of light, not a shadow.
- **The "Ghost Border" Fallback:** If a container sits on a background of the same color (e.g., White on White), use the `outline-variant` token (#a8afa9) at **15% opacity**. It should be barely visible—a whisper of an edge.
- **The 1.3rem Standard:** All containers, buttons, and inputs must strictly adhere to the `xl` (1.3rem / 1.5rem) corner radius. This large radius softens the high-energy green and makes the "Kinetic Canvas" feel approachable.

---

## 5. Components

### Buttons
- **Primary:** Gradient (`primary` to `primary-container`), White text, 1.3rem radius. Use a `0.02em` letter spacing for "Bold" energy.
- **Secondary:** `surface-container-highest` background with `on-primary-fixed` text. This creates a "Quiet Lime" effect.
- **Tertiary:** No background. `primary` text with a subtle underline that appears only on hover.

### Input Fields
- **Default:** `surface-container-lowest` (Pure White) background. No border.
- **Focus State:** A 2px "Ghost Border" using `primary` (#006b0a) and a soft outer glow of `primary-container` at 30% opacity.
- **Labels:** Always `label-md` placed 0.5rem above the input, never placeholder-only.

### Cards & Lists
- **The Divider Ban:** Never use horizontal lines. Separate list items using `surface-container-low` background fills on hover, or 1rem of vertical padding.
- **Feature Cards:** Use "Asymmetric Padding." For example, 3rem padding on the top/left and 2rem on the bottom/right to create a modern, off-balance editorial look.

### Signature Component: The "Energy Bar"
A thin, 4px vertical bar using the `primary` color placed to the left of `headline-sm` text. This serves as a visual "spark" that guides the user through the content hierarchy.

---

## 6. Do’s and Don’ts

### Do:
- Use **Negative Space** as a functional element. Give headlines room to breathe (Spacing 16 or 20).
- Use **Tonal Transitions.** Transition from a white background to a `surface-dim` footer to signal the end of a journey.
- Use **Oversized Icons.** Use thin-stroke icons at 32px or 48px to match the "Modern Professional" aesthetic.

### Don't:
- **Don't use pure black.** Use `on-surface` (#29302c) for text. Pure black kills the vibrance of the lime green.
- **Don't stack buttons vertically** without varying the visual weight. Always have a clear primary/secondary hierarchy.
- **Don't use 100% opaque borders.** They trap the "energy" of the layout and make it feel like a legacy enterprise app.
- **Don't use center-alignment for everything.** Editorial layouts thrive on "Left-Heavy" alignment with generous right-hand white space.