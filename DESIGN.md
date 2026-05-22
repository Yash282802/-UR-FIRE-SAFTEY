---
name: Industrial Safety Core
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#5c403c'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f1f1f1'
  outline: '#916f6b'
  outline-variant: '#e6bdb8'
  surface-tint: '#bf0914'
  primary: '#b1000f'
  on-primary: '#ffffff'
  primary-container: '#d72323'
  on-primary-container: '#ffefed'
  inverse-primary: '#ffb4ab'
  secondary: '#5f5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e2dfde'
  on-secondary-container: '#636262'
  tertiary: '#794e00'
  on-tertiary: '#ffffff'
  tertiary-container: '#996400'
  on-tertiary-container: '#fff1e4'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad6'
  primary-fixed-dim: '#ffb4ab'
  on-primary-fixed: '#410002'
  on-primary-fixed-variant: '#93000b'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474746'
  tertiary-fixed: '#ffddb4'
  tertiary-fixed-dim: '#ffb955'
  on-tertiary-fixed: '#291800'
  on-tertiary-fixed-variant: '#633f00'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  headline-xl:
    fontFamily: Oswald
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: 0.02em
  headline-lg:
    fontFamily: Oswald
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Oswald
    fontSize: 28px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Oswald
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Source Sans Three
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Source Sans Three
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-bold:
    fontFamily: Source Sans Three
    fontSize: 14px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Source Sans Three
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.2'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
---

## Brand & Style
The design system is engineered for **Industrial Authority**. It communicates reliability, urgency, and technical precision for the fire safety sector. The aesthetic balances **Modern Corporate** structure with **Refined Brutalism**, utilizing high-contrast elements and heavy strokes to evoke the feeling of heavy-duty equipment and safety signage. 

The UI should feel "constructed" rather than "drawn," prioritizing clear information hierarchy and high-visibility status indicators. It is designed to instill confidence in safety professionals and facility managers alike.

## Colors
The palette is rooted in high-visibility safety standards. 
- **Primary Red (#D72323):** Used for critical actions, branding, and status indicators. It is the "Warning" and "Action" color.
- **Secondary Black (#1A1A1A):** Provides the grounding force. Used for heavy typography and structural elements to ensure a professional, industrial look.
- **Accent Amber (#F5A623):** Reserved for cautionary information, secondary highlights, and technical details that require attention without the urgency of red.
- **Neutral White/Grey:** The background remains clean (#FFFFFF) with neutral surfaces (#F4F4F4) to ensure the bold brand colors remain impactful.

## Typography
Typography follows a strict hierarchy. **Oswald** is used for all headings to provide a condensed, impactful, and "architectural" feel. Headings should frequently use uppercase to mimic industrial labeling and signage. 

**Source Sans Three** is the utilitarian workhorse for body text, providing exceptional legibility for technical specifications and safety instructions. It remains neutral and professional, ensuring that data is the focus.

## Layout & Spacing
The layout follows an **8px hard grid system**, ensuring all elements align with mathematical precision. 

- **Desktop:** A 12-column fluid grid with 24px gutters. Content is often housed in structured blocks to reflect organized inventory or technical sheets.
- **Mobile:** A 4-column grid with 16px side margins.
- **Philosophy:** Spacing is generous but structured. Use larger "xl" spacing to separate major technical sections, and tight "xs/sm" spacing for related data points in technical tables.

## Elevation & Depth
This design system avoids soft, floating aesthetics in favor of **Structural Layering**.

1.  **Low-Contrast Outlines:** Surfaces are primarily separated by 1px or 2px borders (Secondary Black or Light Grey) rather than heavy shadows. This mimics the look of metal plates and industrial housing.
2.  **Hard Shadows:** When elevation is required (e.g., on hover), use a "Technical Shadow"—a crisp, low-blur offset shadow (e.g., 4px offset, 0px blur) in a semi-transparent black.
3.  **Tonal Stacking:** Use light grey (#F4F4F4) for container backgrounds to distinguish them from the main page background.

## Shapes
The shape language is **Precision-Cut**. Elements use a "Soft" (4px) corner radius to prevent the UI from feeling dated or hostile, but the radius is small enough to maintain a rigid, mechanical appearance. Large components like buttons and cards should feel like solid blocks.

## Components
- **Cards:** White background with a 1px neutral border. Every card features a **4px solid top-border** in Primary Red to create a consistent brand thread across the layout.
- **Buttons:** 
    - *Primary:* Solid Red background, White text (Oswald Bold), 0px or 4px radius.
    - *Secondary:* Solid Black background. 
    - *Interactive:* Smooth 0.2s transition. On hover, buttons should shift slightly (2px) or darken.
- **Inputs:** High-contrast borders (1px Black). Labels are always in "label-bold" (Source Sans Three, Uppercase) positioned above the field.
- **Chips/Status:** Use the Primary Red for "Danger/Active," Accent Amber for "Pending/Service Required," and Black for "Inactive."
- **Lists:** Technical data lists should use alternating row colors (White and #F9F9F9) with a vertical Red line on the left side of the active or "critical" item.
- **Data Visuals:** Use high-contrast bar charts or gauges that utilize the Primary Red and Accent Amber to indicate safety levels or pressure readings.